export const convertTimeToHoursAgo = (time: string) => {
    const timeAgo = new Date(time);
    const now = new Date();
    const diff = now.getTime() - timeAgo.getTime();
    const hours = Math.floor(diff / 1000 / 60 / 60);
    if (hours < 24) {
        return hours;
    } else {
        return convertHoursToDaysAgo(hours);
    }
};

export const convertHoursToDaysAgo = (hours: number) => {
    const days = Math.floor(hours / 24);
    return days;
};
