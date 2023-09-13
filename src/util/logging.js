import { getCurrentFeature } from '../workQ.js';
import { config } from '../config.js';
import { dateToIsoString } from './dateHelper.js';

export class TicketError extends Error {
    constructor(ticket, message) {
        super(message);
        this.name   = 'TicketError';
        this.ticket = ticket;
    }
}

export function fine(source, ...data) {
    if (config.FINE_MODE) log('FINE', COLOR.Dim + COLOR.FgWhite, source, data);
}

export function debug(source, ...data) {
    if (config.DEBUG_MODE) log('DEBUG', COLOR.FgWhite, source, data);
}

export function info(source, ...data) {
    log('INFO', COLOR.Reset, source, data);
}

export function warn(source, ...data) {
    log('WARN', COLOR.Bright + COLOR.FgYellow, source, data);
}

export function errorWithTicket(source, ticket, ...data) {
    if (ticket) {
        log('ERROR', COLOR.Bright + COLOR.FgRed, source, data);
        throw new TicketError(ticket, '[' + source + '][' + ticket + '] ' + JSON.stringify(data));
    } else {
        error(source, data);
    }
}

export function error(source, ...data) {
    log('ERROR', COLOR.Bright + COLOR.FgRed, source, data);
    throw new Error('[' + source + '] ' + JSON.stringify(data));
}

function log(level, color, source, data) {
    const args          = Array.prototype.slice.call(data);
    const featureString = getCurrentFeature() ? getCurrentFeature().name : 'NO_FEATURE';
    let message         = color;
    if (!config.IS_UNIT_TEST) message += dateToIsoString(new Date());
    message += '[' + level + ']' + '[' + featureString + ']' + '[' + source + ']';
    args.unshift(message);
    args.push(COLOR.Reset);
    console.log.apply(console, args);
}

const COLOR = {
    Reset:      '\x1b[0m',
    Bright:     '\x1b[1m',
    Dim:        '\x1b[2m',
    Underscore: '\x1b[4m',
    Blink:      '\x1b[5m',
    Reverse:    '\x1b[7m',
    Hidden:     '\x1b[8m',

    FgBlack:   '\x1b[30m',
    FgRed:     '\x1b[31m',
    FgGreen:   '\x1b[32m',
    FgYellow:  '\x1b[33m',
    FgBlue:    '\x1b[34m',
    FgMagenta: '\x1b[35m',
    FgCyan:    '\x1b[36m',
    FgWhite:   '\x1b[37m',

    BgBlack:   '\x1b[40m',
    BgRed:     '\x1b[41m',
    BgGreen:   '\x1b[42m',
    BgYellow:  '\x1b[43m',
    BgBlue:    '\x1b[44m',
    BgMagenta: '\x1b[45m',
    BgCyan:    '\x1b[46m',
    BgWhite:   '\x1b[47m',
};
