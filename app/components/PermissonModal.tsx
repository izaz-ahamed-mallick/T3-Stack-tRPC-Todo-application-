import { trpc } from "@/utils/trpcClient";
import React, { useEffect, useState } from "react";
interface PermissonModalPropsType {
    handleOnSavePermisson: () => void;
    isModalOpen: boolean;
    currentUserId: string | null;
}

const PermissonModal = ({
    currentUserId,
    handleOnSavePermisson,
    isModalOpen,
}: PermissonModalPropsType) => {
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
        []
    );
    const { data: userPermissions } = trpc.admin.getUserPermissions.useQuery(
        { userId: currentUserId! },
        { enabled: !!currentUserId && isModalOpen }
    );
    const utils = trpc.useUtils();
    useEffect(() => {
        if (userPermissions) {
            setSelectedPermissions(userPermissions as string[]);
        }
    }, [userPermissions]);

    const updateUserRole = trpc.admin.updateUserRole.useMutation({
        onSuccess: () => {
            utils.admin.getActivityLogs.invalidate();
            utils.admin.getUsers.invalidate();
            handleOnSavePermisson();
        },
    });

    const handleTogglePermission = (permission: string) => {
        setSelectedPermissions((prev) =>
            prev.includes(permission)
                ? prev.filter((p) => p !== permission)
                : [...prev, permission]
        );
    };
    const handleSubmitPermissions = async () => {
        if (!currentUserId) return;

        await updateUserRole.mutateAsync({
            userId: currentUserId,
            role: "subadmin",
            permissions: selectedPermissions,
        });

        setSelectedPermissions([]);
    };
    if (!isModalOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-900 text-white p-6 rounded-lg shadow-xl w-[90%] max-w-md">
                <h2 className="text-xl font-bold mb-4">
                    Set Permissions for Subadmin
                </h2>

                <div className="space-y-3">
                    {["view", "edit", "delete"].map((perm) => (
                        <label
                            key={perm}
                            className="flex items-center gap-3 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                className="w-5 h-5 accent-primary"
                                checked={selectedPermissions.includes(perm)}
                                onChange={() => handleTogglePermission(perm)}
                            />
                            <span className="text-lg capitalize">{perm}</span>
                        </label>
                    ))}
                </div>

                <div className="flex justify-end gap-4 mt-5">
                    <button
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md"
                        onClick={handleOnSavePermisson}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-primary hover:bg-primary-dark rounded-md"
                        onClick={handleSubmitPermissions}
                    >
                        {updateUserRole.isPending ? "Conform..." : "Conform"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PermissonModal;
