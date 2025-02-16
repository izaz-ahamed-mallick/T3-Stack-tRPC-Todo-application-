import { useMemo } from "react";

export function useTaskStatus(todo: { reminder?: Date; deadline?: Date }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for accurate comparisons

    const reminderDate = todo.reminder ? new Date(todo.reminder) : null;
    const deadlineDate = todo.deadline ? new Date(todo.deadline) : null;

    return useMemo(() => {
        const isReminderToday =
            reminderDate?.toDateString() === today.toDateString();

        const isReminderOverdue =
            reminderDate && reminderDate < today && !isReminderToday;

        const isDeadlineToday =
            deadlineDate?.toDateString() === today.toDateString();

        const isDeadlineOverdue =
            deadlineDate && deadlineDate < today && !isDeadlineToday;

        const isDeadlineSoon =
            deadlineDate &&
            deadlineDate > today &&
            (deadlineDate.getTime() - today.getTime()) /
                (1000 * 60 * 60 * 24) <=
                2 &&
            !isDeadlineToday;

        return {
            isReminderToday,
            isReminderOverdue,
            isDeadlineToday,
            isDeadlineOverdue,
            isDeadlineSoon,
            reminderDate: reminderDate?.toLocaleString() ?? null,
            deadlineDate: deadlineDate?.toLocaleString() ?? null,
        };
    }, [reminderDate, deadlineDate]);
}
