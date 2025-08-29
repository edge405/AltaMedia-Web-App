import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Palette, Megaphone, Sparkles, Send, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function ProjectForms({ onProjectCreated }) {
    const [activeForm, setActiveForm] = useState("branding");
    const [formData, setFormData] = useState({
        project_name: "",
        project_type: "branding",
        description: "",
        deadline: null,
        budget_allocated: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validateForm = () => {
        const errors = [];

        if (!formData.project_name.trim()) {
            errors.push('Project name is required');
        }

        if (!formData.description.trim()) {
            errors.push('Project description is required');
        }

        if (!formData.deadline) {
            errors.push('Project deadline is required');
        }

        if (!formData.budget_allocated || parseFloat(formData.budget_allocated) <= 0) {
            errors.push('Valid budget amount is required');
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateForm();
        if (errors.length > 0) {
            setValidationErrors(errors);
            toast.error('Please fill in all required fields');
            return;
        }

        setValidationErrors([]);
        setIsSubmitting(true);

        try {
            // Mock project creation since Base44 API is removed
            const projectData = {
                ...formData,
                client_id: "demo-client",
                deadline: formData.deadline ? format(formData.deadline, "yyyy-MM-dd") : null,
                budget_allocated: parseFloat(formData.budget_allocated) || 0,
                progress: 0,
                status: "draft"
            };

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Reset form
            setFormData({
                project_name: "",
                project_type: activeForm,
                description: "",
                deadline: null,
                budget_allocated: ""
            });

            onProjectCreated?.();
        } catch (error) {
            console.error("Error creating project:", error);
        }

        setIsSubmitting(false);
    };

    const formTypes = [
        {
            id: "branding",
            title: "Branding Kit",
            icon: Palette,
            description: "Logo design, brand guidelines, and visual identity",
            color: "text-pink-600",
            bgColor: "bg-pink-100"
        },
        {
            id: "campaign",
            title: "Marketing Campaign",
            icon: Megaphone,
            description: "Multi-channel marketing campaigns and creative assets",
            color: "text-blue-600",
            bgColor: "bg-blue-100"
        },
        {
            id: "creative_services",
            title: "Creative Services",
            icon: Sparkles,
            description: "Custom creative work and multimedia content",
            color: "text-purple-600",
            bgColor: "bg-purple-100"
        }
    ];

    const activeFormType = formTypes.find(f => f.id === activeForm);

    return (
        <Card className="glass-effect border-slate-200/50 shadow-lg">
            <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-slate-800">Start New Project</CardTitle>
                <p className="text-sm text-slate-600">Choose a service and provide project details</p>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Form Type Selector */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {formTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => {
                                setActiveForm(type.id);
                                handleInputChange("project_type", type.id);
                            }}
                            className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${activeForm === type.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <div className={`${type.bgColor} p-2 rounded-lg`}>
                                    <type.icon className={`w-5 h-5 ${type.color}`} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-800">{type.title}</h3>
                                    <p className="text-xs text-slate-500 mt-1">{type.description}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Validation Errors */}
                {validationErrors.length > 0 && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="font-medium text-red-800 mb-2">
                                    Please fix the following errors:
                                </h4>
                                <ul className="list-disc list-inside space-y-1">
                                    {validationErrors.map((error, index) => (
                                        <li key={index} className="text-red-700 text-sm">
                                            {error}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Project Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="project_name">Project Name</Label>
                            <Input
                                id="project_name"
                                value={formData.project_name}
                                onChange={(e) => handleInputChange("project_name", e.target.value)}
                                placeholder={`${activeFormType?.title} project name`}
                                required
                                className="bg-white/50 border-slate-200 focus:bg-white focus:border-blue-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="budget">Budget (USD)</Label>
                            <Input
                                id="budget"
                                type="number"
                                value={formData.budget_allocated}
                                onChange={(e) => handleInputChange("budget_allocated", e.target.value)}
                                placeholder="5000"
                                min="0"
                                step="100"
                                className="bg-white/50 border-slate-200 focus:bg-white focus:border-blue-300"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Project Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Describe your project requirements, goals, and any specific details..."
                            rows={4}
                            className="bg-white/50 border-slate-200 focus:bg-white focus:border-blue-300"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Project Deadline</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-left bg-white/50 border-slate-200 hover:bg-white hover:border-blue-300"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formData.deadline ? format(formData.deadline, "PPP") : "Select deadline"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={formData.deadline}
                                    onSelect={(date) => handleInputChange("deadline", date)}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => setFormData({
                                project_name: "",
                                project_type: activeForm,
                                description: "",
                                deadline: null,
                                budget_allocated: ""
                            })}
                        >
                            Clear Form
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        >
                            {isSubmitting ? (
                                "Creating..."
                            ) : (
                                <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Submit Project
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}