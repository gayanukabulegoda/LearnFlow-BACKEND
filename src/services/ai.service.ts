import axios from 'axios';
import natural from 'natural';
import compromise from 'compromise';
import {ResourceType} from '@prisma/client';
import logger from '../utils/logger';

const WIKI_API_ENDPOINT = 'https://en.wikipedia.org/w/api.php';
const MDN_SEARCH_API = 'https://developer.mozilla.org/api/v1/search';

interface Recommendation {
    title: string;
    url: string;
    type: ResourceType;
    description?: string;
    reason: string;
    aiScore: number;
}

// Separate caches for each API
const wikiCache = new Map<string, Recommendation[]>();
const mdnCache = new Map<string, Recommendation[]>();

export const analyzeLearningGoal = async (
    goal: { title: string; description?: string | null }
): Promise<Recommendation[]> => {
    try {
        // Combine title and description then convert to lowercase for processing
        const text = `${goal.title} ${goal.description || ''}`.toLowerCase();
        const doc = compromise(text);

        // Extract nouns and adjectives, remove duplicates, short words, and stopwords
        const rawKeywords = [
            ...new Set([
                ...doc.nouns().out('array'),
                ...doc.adjectives().out('array')
            ])
        ];

        const keywords = rawKeywords
            .filter(term => term.length > 3)
            .map(term => natural.PorterStemmer.stem(term))
            .filter(term => !natural.stopwords.includes(term));

        if (keywords.length === 0) {
            logger.warn('No valid keywords extracted', {goal});
            return [];
        }

        // Form a refined search term from the first three keywords and remove special characters
        const searchTerm = keywords
            .slice(0, 3)
            .join(' ')
            .replace(/[^a-zA-Z0-9 ]/g, '');
        if (!searchTerm) {
            logger.warn('Search term is empty after processing keywords', {keywords});
            return [];
        }

        logger.info('Searching recommendations for:', {searchTerm});

        // Fetch Wikipedia recommendations (with caching)
        let wikiRecommendations: Recommendation[];
        if (wikiCache.has(searchTerm)) {
            logger.info('Returning cached Wikipedia recommendations', {searchTerm});
            wikiRecommendations = wikiCache.get(searchTerm)!;
        } else {
            wikiRecommendations = await getWikiRecommendations(searchTerm, keywords);
            wikiCache.set(searchTerm, wikiRecommendations);
        }

        // Fetch MDN recommendations (with caching)
        let mdnRecommendations: Recommendation[];
        if (mdnCache.has(searchTerm)) {
            logger.info('Returning cached MDN recommendations', {searchTerm});
            mdnRecommendations = mdnCache.get(searchTerm)!;
        } else {
            mdnRecommendations = await getMDNRecommendations(searchTerm);
            mdnCache.set(searchTerm, mdnRecommendations);
        }

        // Combine results from both sources
        const combinedRecommendations = [...wikiRecommendations, ...mdnRecommendations];
        logger.info('Combined recommendations:', combinedRecommendations);
        return combinedRecommendations;
    } catch (error) {
        logger.error('AI recommendation failed:', error);
        return [];
    }
};

const getWikiRecommendations = async (
    searchTerm: string,
    keywords: string[]
): Promise<Recommendation[]> => {
    try {
        const response = await axios.get(WIKI_API_ENDPOINT, {
            params: {
                action: 'query',
                list: 'search',
                srsearch: searchTerm,
                format: 'json',
            },
        }) as any;

        if (!response.data.query || !response.data.query.search) {
            logger.info('No Wikipedia results found', {searchTerm});
            return [];
        }

        const recommendations: Recommendation[] = response.data.query.search.map((item: any) => {
            // Clean the snippet from HTML tags
            const snippet = item.snippet.replace(/<[^>]*>/g, '');
            const title: string = item.title;
            const url = `https://en.wikipedia.org/?curid=${item.pageid}`;
            const fullContent = `${title} ${snippet}`;

            return {
                title,
                url,
                type: ResourceType.ARTICLE,
                description: snippet,
                reason: `Wikipedia article related to "${searchTerm}"`,
                aiScore: calculateRelevanceScore(fullContent, keywords),
            };
        });

        // Lowered threshold to include recommendations with aiScore >= 0.1
        return recommendations.filter(rec => rec.aiScore >= 0.1);
    } catch (error) {
        logger.error('Wikipedia recommendation failed:', error);
        return [];
    }
};

const getMDNRecommendations = async (query: string): Promise<Recommendation[]> => {
    try {
        const {data} = await axios.get(MDN_SEARCH_API, {
            params: {q: query}
        }) as any;

        return data.documents.map((doc: any) => ({
            title: doc.title,
            url: `https://developer.mozilla.org${doc.mdn_url}`,
            type: ResourceType.DOCUMENTATION,
            description: doc.summary,
            reason: `MDN documentation for: ${query}`,
            aiScore: 0.8 // High base score for official docs
        }));
    } catch (error) {
        logger.error('MDN recommendation failed:', error);
        return [];
    }
};

const calculateRelevanceScore = (
    content: string,
    keywords: string[]
): number => {
    const contentLower = content.toLowerCase();
    const stemmedContent = natural.PorterStemmer.tokenizeAndStem(contentLower).join(' ');
    return keywords.reduce((score, keyword) => {
        const occurrences = (stemmedContent.match(new RegExp(keyword, 'g')) || []).length;
        return score + occurrences * 0.1;
    }, 0);
};