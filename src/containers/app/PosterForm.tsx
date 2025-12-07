import type { UseFormReturn } from "react-hook-form";
import type { FormType } from "./NewRequestDialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { Select, SelectGroup, SelectItem, SelectLabel, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";

const PosterForm = ({ form }: { form: UseFormReturn<FormType, any, FormType> }) => {
    // Overview
    const [purpose, setPurpose] = React.useState<string>('')

    // Content Layout
    const [title, setTitle] = React.useState<string>('')
    const [content, setContent] = React.useState<string>('')

    // Company Background
    const [companyName, setCompanyName] = React.useState<string>('')
    const [tagline, setTagline] = React.useState<string>('')
    const [industry, setIndustry] = React.useState<string>('')
    const [products, setProducts] = React.useState<string>('')

    // Visual Preferences
    const [colors, setColors] = React.useState<string>('')
    const [style, setStyle] = React.useState<string>('')

    // Target and Strategy
    const [target, setTarget] = React.useState<string>('')
    const [brand, setBrand] = React.useState<string>('')
    const [mood, setMood] = React.useState<string>('')

    // Additional Detail
    const [platform, setPlatform] = React.useState<string>('')
    const [aspect, setAspect] = React.useState<string>('1:1')

    React.useEffect(() => {
        form.setValue('initialMessage.content',
`OVERVIEW
- Purpose: ${purpose || 'N/A'}

CONTENT LAYOUT
- Title: ${title || 'N/A'}
- Content: ${content || 'N/A'}

COMPANY BACKGROUND
- Name: ${companyName || 'N/A'}
- Tagline: ${tagline || 'N/A'}
- Industry: ${industry || 'N/A'}
- Products Offered: ${products || 'N/A'}

VISUAL PREFERENCES
- colors: ${colors || 'N/A'}
- style preferences: ${style || 'N/A'}

TARGETING & STRATEGY
- Target Audience: ${target || 'N/A'}
- Brand Personality: ${brand || 'N/A'}
- Mood: ${mood || 'N/A'}

ADDITIONAL DETAILS
- Platform: ${platform || 'N/A'}
- Aspect Ratio: ${aspect || 'N/A'}`
        )
    }, [purpose, title, content, companyName, tagline, industry, products, colors, style, target, brand, mood, platform, aspect])

    return (
        <div className="flex flex-col gap-4">
            <h1 className="font-bold">Poster Spesification</h1>
            <div className="flex flex-col gap-2">
                <h2 className="font-bold text-sm">Overview</h2>
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold">Purpose</p>
                    <Input value={purpose} onChange={(e) => setPurpose(e.target.value)} className="bg-white" placeholder="The purpose of the poster" />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <h2 className="font-bold text-sm">Content Layout</h2>
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold">Title</p>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-white" placeholder="The main headline" />
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold">Content</p>
                    <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="bg-white" placeholder="Main content of the poster" />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <h2 className="font-bold text-sm">Company Background</h2>
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold">Company Name</p>
                    <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="bg-white" placeholder="The company name" />
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold">Tagline</p>
                    <Input value={tagline} onChange={(e) => setTagline(e.target.value)} className="bg-white" placeholder="The tagline" />
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold">Industry</p>
                    <Input value={industry} onChange={(e) => setIndustry(e.target.value)} className="bg-white" placeholder="What industry the company operates in" />
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold">Product Offered</p>
                    <Input value={products} onChange={(e) => setProducts(e.target.value)} className="bg-white" placeholder="What product/service offered" />
                </div>
            </div>
            
            <div className="flex flex-col gap-2">
                <h2 className="font-bold text-sm">Visual Preferences</h2>
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold">Color Scheme</p>
                    <Input value={colors} onChange={(e) => setColors(e.target.value)} className="bg-white" placeholder="Color to be used" />
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold">Style Preference</p>
                    <Input value={style} onChange={(e) => setStyle(e.target.value)} className="bg-white" placeholder="Style of the design" />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h2 className="font-bold text-sm">Target and Strategy</h2>

                <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold">Target Audience</p>
                    <Input value={target} onChange={(e) => setTarget(e.target.value)} className="bg-white" placeholder="The audience characteristic" />
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold">Brand Personality</p>
                    <Input value={brand} onChange={(e) => setBrand(e.target.value)} className="bg-white" placeholder="Tone and personality of the brand" />
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold">Mood</p>
                    <Input value={mood} onChange={(e) => setMood(e.target.value)} className="bg-white" placeholder="What emotion should the design evoke" />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h2 className="font-bold text-sm">Additonal Details</h2>

                <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold">Platform</p>
                    <Input value={platform} onChange={(e) => setPlatform(e.target.value)} className="bg-white" placeholder="e.g. Instagram, Facebook, LinkedIn" />
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold">Aspect Ratio</p>
                    <Select value={aspect} onValueChange={setAspect}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder='Select aspect ratio' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1:1" >1:1</SelectItem>
                            <SelectGroup>
                                <SelectLabel>Vertical</SelectLabel>
                                <SelectItem disabled value="3:4" >3:4</SelectItem>
                                <SelectItem disabled value="4:5" >4:5</SelectItem>
                                <SelectItem disabled value="9:16" >9:16</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                                <SelectLabel>Horizontal</SelectLabel>
                                <SelectItem disabled value="4:3" >3:4</SelectItem>
                                <SelectItem disabled value="5:4" >4:5</SelectItem>
                                <SelectItem disabled value="16:9" >16:9</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <h2 className="font-bold text-sm">Additional Details Details</h2>
            </div>
        </div>
    )
}

export default PosterForm