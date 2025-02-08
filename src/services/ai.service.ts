import natural from 'natural';
import compromise from 'compromise';
import prisma from '../prisma/prisma-client';
import {LearningGoal, ResourceType} from '@prisma/client';
import logger from '../utils/logger';

// Mock knowledge base (replace with real data)
const RESOURCE_KB = [
    {
        title: 'React Official Docs',
        url: 'https://react.dev',
        type: 'DOCUMENTATION' as ResourceType,
        tags: ['react', 'frontend', 'javascript']
    },
    {
        title: 'TypeScript Deep Dive',
        url: 'https://basarat.gitbook.io/typescript/',
        type: 'BOOK' as ResourceType,
        tags: ['typescript', 'fundamentals']
    }
];

// Initialize NLP tools
const tfidf = new natural.TfIdf();
const stemmer = natural.PorterStemmer;

interface Recommendation {
    title: string;
    url: string;
    type: ResourceType;
    reason: string;
    aiScore: number;
    tags: string[];
}

export const analyzeLearningGoal = async (goal: LearningGoal): Promise<Recommendation[]> => {
    try {
        // Extract keywords using Compromise
        const doc = compromise(`${goal.title} ${goal.description}`);
        const nouns = doc.nouns().out('array');
        const adjectives = doc.adjectives().out('array');
        const keywords = [...new Set([...nouns, ...adjectives])];

        // Stem keywords
        const stemmedKeywords = keywords.map(k => stemmer.stem(k.toLowerCase()));

        // TF-IDF analysis
        tfidf.addDocument(stemmedKeywords.join(' '));

        // Score resources
        const recommendations = RESOURCE_KB.map(resource => {
            const resourceTerms = [...resource.tags, resource.type.toLowerCase()];
            const score = resourceTerms.reduce((acc, term) => {
                const stemmedTerm = stemmer.stem(term);
                return acc + (stemmedKeywords.includes(stemmedTerm) ? 1 : 0);
            }, 0);

            return {
                ...resource,
                aiScore: score / resourceTerms.length,
                reason: `Matches your interest in: ${keywords.slice(0, 3).join(', ')}`,
            };
        });

        // Filter and sort recommendations
        return recommendations
            .filter(r => r.aiScore > 0.3)
            .sort((a, b) => b.aiScore - a.aiScore)
            .slice(0, 5);

    } catch (error) {
        logger.error('AI analysis failed:', error);
        return [];
    }
};

// Optional: Train TF-IDF with sample data
export const trainRecommendationModel = async () => {
    const goals = await prisma.learningGoal.findMany({
        select: {title: true, description: true}
    });

    goals.forEach(goal => {
        const text = `${goal.title} ${goal.description}`;
        tfidf.addDocument(text.toLowerCase());
    });
};