export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

export function generateColor(): string {
    const colors = ['#3B82F6', '#EC4899', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316'];
    return colors[Math.floor(Math.random() * colors.length)];
}
