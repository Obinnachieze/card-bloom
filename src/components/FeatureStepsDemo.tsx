import { FeatureSteps } from "@/components/ui/feature-section"

const features = [
    {
        step: 'Step 1',
        title: 'Pick a Template or Start Fresh',
        content: 'Choose from our curated collection of beautiful card designs or start with a blank canvas to express your unique style.',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop'
    },
    {
        step: 'Step 2',
        title: 'Personalize with Love',
        content: 'Add your own heartfelt message, beautiful photos, and fun emojis to make your digital card truly special and personal for your recipient.',
        image: 'https://images.unsplash.com/photo-1543157145-f78c636d023c?q=80&w=2070&auto=format&fit=crop'
    },
    {
        step: 'Step 3',
        title: 'Share the Joy Instantly',
        content: 'Send your creative masterpiece instantly via email or social media, bringing a smile to someone\'s face wherever they are in the world.',
        image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=2070&auto=format&fit=crop'
    },
]

export function FeatureStepsDemo() {
    return (
        <FeatureSteps
            features={features}
            title="Create Your Perfect Card in Minutes"
            autoPlayInterval={5000}
            imageHeight="h-[500px]"
        />
    )
}
