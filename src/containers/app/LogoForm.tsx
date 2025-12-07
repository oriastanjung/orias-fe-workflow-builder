import { Input } from "@/components/ui/input"
import type { UseFormReturn } from "react-hook-form"
import type { FormType } from "./NewRequestDialog"
import React from "react"

const LogoForm = ({ form }: { form: UseFormReturn<FormType, any, FormType> }) => {
    // Hold internal states
    const [name, setName] = React.useState<string>("")
    const [tagline, setTagline] = React.useState<string>("")
    const [industry, setIndustry] = React.useState<string>("")
    const [product, setProduct] = React.useState<string>("")
    const [color, setColor] = React.useState<string>("")
    const [style, setStyle] = React.useState<string>("")
    const [icon, setIcon] = React.useState<string>("")
    const [target, setTarget] = React.useState<string>("")
    const [personality, setPersonality] = React.useState<string>("")

    React.useEffect(() => {
        form.setValue('initialMessage.content', 
`Background
- Company/Brand/Organization Name: ${name || 'User mentioned to not include'}
- Tagline: ${tagline || 'User mentioned to not include'}
- Industry: ${industry || 'User mentioned to not include'}
- Product: ${product || 'User mentioned to not include'}

Visual Preferences
- Color: ${color || 'User mentioned to not include'}
- Style: ${style || 'User mentioned to not include'}
- Icon: ${icon || 'User mentioned to not include'}

Target Details
- Target Audience: ${target || 'User mentioned to not include'}
- Brand Personality: ${personality || 'User mentioned to not include'}`)
    }, [name, tagline, industry, product, color, style, icon, target, personality, form])

    return (
        <div className="flex flex-col gap-4">
            <h1 className="font-bold">Logo Spesification</h1>
            <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold">Company/Brand/Organization Name</p>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-white" placeholder="Name of the brand to be included in the logo" />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold">Tagline</p>
                <Input value={tagline} onChange={(e) => setTagline(e.target.value)} className="bg-white" placeholder="Tagline/slogan/motto to be included in the logo" />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold">Industry</p>
                <Input value={industry} onChange={(e) => setIndustry(e.target.value)} className="bg-white" placeholder="The industry the Company/Brand/Organization operates in" />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold">Product or Service Offered</p>
                <Input value={product} onChange={(e) => setProduct(e.target.value)} className="bg-white" placeholder="Type of product or service offered by the Company/Brand/Organization" />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold">Color Scheme</p>
                <Input value={color} onChange={(e) => setColor(e.target.value)} className="bg-white" placeholder="List of colors you want to use" />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold">Style Preference</p>
                <Input value={style} onChange={(e) => setStyle(e.target.value)} className="bg-white" placeholder="Design style preferences" />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold">Relevant Icon or Symbols</p>
                <Input value={icon} onChange={(e) => setIcon(e.target.value)} className="bg-white" placeholder="Symbols that align with the company's visual branding/mission" />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold">Target Audience</p>
                <Input value={target} onChange={(e) => setTarget(e.target.value)} className="bg-white" placeholder="Demographic" />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold">Brand Personality</p>
                <Input value={personality} onChange={(e) => setPersonality(e.target.value)} className="bg-white" placeholder="Emotions or values to evoke" />
            </div>
        </div>
    )
}

export default LogoForm