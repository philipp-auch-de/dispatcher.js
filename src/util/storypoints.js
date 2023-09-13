import { warn } from './logging.js';

export function calcStoryPointsByDates(dateStart, dateEnd) {
    const ms    = dateEnd - dateStart;
    const hours = ms / 1000 / 60 / 60;
    return calcStoryPointsByHours(hours);
}

export function calcStoryPointsByDurationString(duration) {
    let match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

    if (!match || !match.length) {
        warn('STPO', 'Unable to cast duration \"' + duration + '\". Returning 0');
        return 0;
    }
    match = match.slice(1).map(function(x) {
        if (x != null) {
            return x.replace(/\D/, '');
        }
    });

    const hours   = (parseInt(match[0]) || 0);
    const minutes = (parseInt(match[1]) || 0);
    const seconds = (parseInt(match[2]) || 0);

    return calcStoryPointsByHours(hours + (minutes / 60) + (seconds / 60 / 60));
}

export function calcStoryPointsByHours(hours) {
    if (hours > 40) {
        return 100;
    } else if (hours > 20) {
        return 40;
    } else if (hours > 13) {
        return 20;
    } else if (hours > 8) {
        return 13;
    } else if (hours > 5) {
        return 8;
    } else if (hours > 3) {
        return 5;
    } else if (hours > 2) {
        return 3;
    } else if (hours > 1) {
        return 2;
    } else if (hours > 0.5) {
        return 1;
    } else {
        return 0.5;
    }
}
