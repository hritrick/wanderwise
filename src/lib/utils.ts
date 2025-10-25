// Helper function to format date
export const formatDate = (date: string) => {
    if (!date) return 'N/A';
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    try {
        return new Date(date).toLocaleDateString('en-US', options);
    } catch (e) {
        return 'Invalid Date';
    }
};