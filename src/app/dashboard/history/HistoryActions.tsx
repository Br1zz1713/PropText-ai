"use client";

import { useState } from "react";
import { Trash2, Copy, Check, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ListingModal from "@/components/dashboard/ListingModal";

export default function HistoryActions({ id, text, type, title }: { id: string; text: string, type: string, title: string }) {
    const [deleting, setDeleting] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this generation?")) return;
        setDeleting(true);

        try {
            const res = await fetch(`/api/generations/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                toast.success("Deleted successfully");
                router.refresh();
            } else {
                toast.error("Failed to delete");
            }
        } catch (e) {
            toast.error("Error deleting");
        } finally {
            setDeleting(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    }

    // Mock listing object for the modal
    const listingForModal = {
        id: id,
        title: title,
        description: text,
        type: type,
        created_at: new Date().toISOString(),
    };

    return (
        <>
            <div className="flex gap-2">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
                    title="View Full"
                >
                    <Eye className="h-4 w-4" />
                </button>
                <button
                    onClick={handleCopy}
                    className="p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
                    title="Copy Text"
                >
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </button>
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                    title="Delete"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            <ListingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                listing={listingForModal}
                tableName="generations"
                columnName="output_text"
            />
        </>
    );
}
