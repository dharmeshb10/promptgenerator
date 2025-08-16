
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import PromptForm from './components/PromptForm';
import PromptDisplay from './components/PromptDisplay';
import Loader from './components/Loader';
import Footer from './components/Footer';
import { generateIntellectualPrompt } from './services/geminiService';

const App: React.FC = () => {
    const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGeneratePrompt = useCallback(async (
        role: string, 
        topic: string, 
        language: string,
        audience: string,
        tones: string[],
        length: string,
        specialInstructions: string
    ) => {
        setIsLoading(true);
        setError(null);
        setGeneratedPrompt('');
        try {
            const prompt = await generateIntellectualPrompt(role, topic, language, audience, tones, length, specialInstructions);
            setGeneratedPrompt(prompt);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-4xl flex flex-col flex-grow">
                <Header />
                <main className="flex-grow">
                    <PromptForm onGenerate={handleGeneratePrompt} isLoading={isLoading} />
                    
                    <div className="mt-8">
                        {isLoading && <Loader />}
                        {error && (
                            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
                                <strong className="font-bold">Error: </strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        {generatedPrompt && !isLoading && <PromptDisplay prompt={generatedPrompt} />}
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default App;
