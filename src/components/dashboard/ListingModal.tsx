"use client";

import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Copy, Save, Loader2, Edit, FileText } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Listing {
    id: number | string;
    title: string;
    description: string;
    type: string;
    created_at: string;
}

interface ListingModalProps {
    isOpen: boolean;
    onClose: () => void;
    listing: Listing | null;
    tableName?: string;
    columnName?: string;
}

export default function ListingModal({
    isOpen,
    onClose,
    listing,
    tableName = "listings",
    columnName = "description"
}: ListingModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState("");
    const [saving, setSaving] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    if (!listing) return null;

    // Reset state when opening (handled by useEffect or just init when editing starts)
    const handleEditToggle = () => {
        if (!isEditing) {
            setEditedText(listing.description);
            setIsEditing(true);
        } else {
            setIsEditing(false);
        }
    };

    const handleCopy = () => {
        const textToCopy = isEditing ? editedText : listing.description;
        navigator.clipboard.writeText(textToCopy);
        toast.success("Copied to clipboard");
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from(tableName)
                .update({ [columnName]: editedText })
                .eq("id", listing.id);

            if (error) throw error;

            toast.success("Updated successfully");
            listing.description = editedText; // Optimistic update
            setIsEditing(false);
            router.refresh();
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Failed to update listing");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-card border border-border p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-foreground">
                                                {listing.title || "Property Description"}
                                            </Dialog.Title>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                Generated on {new Date(listing.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="mt-4">
                                    {isEditing ? (
                                        <textarea
                                            value={editedText}
                                            onChange={(e) => setEditedText(e.target.value)}
                                            className="w-full h-64 rounded-xl bg-background/50 border border-input p-4 text-sm text-foreground focus:outline-none focus:border-primary/50 resize-none font-serif leading-relaxed"
                                            placeholder="Edit description..."
                                        />
                                    ) : (
                                        <div className="h-64 overflow-y-auto rounded-xl bg-background/30 border border-border p-4 text-sm text-muted-foreground font-serif leading-relaxed whitespace-pre-wrap">
                                            {listing.description}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={handleEditToggle}
                                            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isEditing
                                                ? "bg-primary/10 text-primary hover:bg-primary/20"
                                                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                                }`}
                                        >
                                            <Edit size={16} />
                                            {isEditing ? "Cancel Edit" : "Edit"}
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={handleCopy}
                                            className="flex items-center gap-2 rounded-lg border border-border bg-background/50 px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
                                        >
                                            <Copy size={16} />
                                            Copy
                                        </button>
                                        {isEditing && (
                                            <button
                                                type="button"
                                                onClick={handleSave}
                                                disabled={saving}
                                                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                                            >
                                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                                Save
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
