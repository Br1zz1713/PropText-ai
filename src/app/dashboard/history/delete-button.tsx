"use client";

import { useState } from "react";
import { Trash2, Copy, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ id, text }: { id: string; text: string }) {
    const [deleting, setDeleting] = useState(false);
    const [copied, setCopied] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this generation?")) return;
        setDeleting(true);

        try {
            const res = await fetch(`/api/generations/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                router.refresh();
            } else {
                alert("Failed to delete");
            }
        } catch (e) {
            alert("Error deleting");
        } finally {
            setDeleting(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="flex gap-2">
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
    );
}
