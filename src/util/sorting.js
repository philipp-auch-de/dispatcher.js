import { error, errorWithTicket, warn } from './logging.js';
import { getLatestSprint, rankIssueAfter } from '../jira/issue.js';
import { getDateFromString } from './dateHelper.js';
import { getEpicProgressPercentage, getEpicRankAsc } from '../epic.js';

const ORDERS = {
    'EPIC_LABELS': {
        field: 'fields.labels[0]',
        order: [
            'Hobby',
            'Github',
            'Chore',
            'Master',
            'Book',
            'Series',
            'YouTube',
        ],
    },
    'ISSUE_TYPE':  {
        field: 'fields.issuetype.name',
        order: [
            'Task',
            'Story',
            'Bug',
            'Event',
            'Chore',
            'Episode',
        ],
    },
    'STATUS ASC':  {
        field: 'fields.status.name',
        order: [
            'To Do',
            'Waiting on Date',
            'WAITING',
            'ANALYSIS',
            'In Progress',
            'Done',
        ],
    },
    'STATUS DESC': {
        field: 'fields.status.name',
        order: [
            'Done',
            'In Progress',
            'ANALYSIS',
            'WAITING',
            'Waiting on Date',
            'To Do',
        ],
    },
};

export function compare(type, a, b, followType, list) {
    let res = 0;
    switch (type) {
        case 'EPIC_LABELS':
        case 'ISSUE_TYPE':
        case 'STATUS ASC':
        case 'STATUS DESC':
            res = compareByList(type, a, b);
            break;
        case 'SPRINT':
            res = comparatorSprint(a, b);
            break;
        case 'CREATED':
            res = comparatorCreated(a, b);
            break;
        case 'PARENT_RANK':
            res = comparatorParentEpicRank(a, b);
            break;
        case 'SPRINT_PROGRESS':
            res = comparatorSprintProgress(a, b);
            break;
        case 'BLOCKING':
            res = comparatorBlockingRelation(a, b, list);
            break;
        default:
            errorWithTicket('SORT', a.key, 'ERROR!', 'Unknown comparing type:', type);
    }

    if (res !== 0) return res;

    if (followType && followType.length !== 0) return compare(followType[0], a, b, followType.splice(1), list);
    return 0;
}

function compareByList(type, a, b) {
    const labelsOrdered = ORDERS[type].order;

    const value1 = Object.byString(a, ORDERS[type].field);
    const value2 = Object.byString(b, ORDERS[type].field);

    if (!value1 && !value2) return 0;
    if (!value1) return 1;
    if (!value2) return 0;

    const indexLabel1 = labelsOrdered.indexOf(value1);
    const indexLabel2 = labelsOrdered.indexOf(value2);

    if (indexLabel1 === -1 || indexLabel2 === -1) {
        errorWithTicket('SORT', a.key, 'One of these labels is unknown:', Object.byString(a, ORDERS[type].field),
                        Object.byString(b, ORDERS[type].field));
    }

    if (indexLabel1 < indexLabel2) return -1;
    if (indexLabel1 > indexLabel2) return 1;

    return 0;
}

function comparatorSprint(a, b) {
    if (!getLatestSprint(a) || !getLatestSprint(b)) return 0;

    if (getLatestSprint(a).startDate < getLatestSprint(b).startDate) return -1;
    if (getLatestSprint(a).startDate > getLatestSprint(b).startDate) return 1;
    return 0;
}

function comparatorCreated(a, b) {
    if (getDateFromString(a.fields['created']) < getDateFromString(b.fields['created'])) return -1;
    if (getDateFromString(a.fields['created']) > getDateFromString(b.fields['created'])) return 1;
    return 0;
}

function comparatorParentEpicRank(a, b) {
    if (!a.fields.parent && !b.fields.parent) return 0;
    if (!a.fields.parent) return -1;
    if (!b.fields.parent) return 1;

    if (a.fields.parent.key === b.fields.parent.key) return 0;

    const rankIssue1 = getEpicRankAsc(a.fields.parent.key);
    const rankIssue2 = getEpicRankAsc(b.fields.parent.key);

    if (rankIssue1 < rankIssue2) return -1;
    if (rankIssue1 > rankIssue2) return 1;

    warn('SORT', 'This point should not be reached! Different epics have same rank!', a.key, a.fields.summary, b.key,
         b.fields.summary);
    return 0;
}

function comparatorSprintProgress(a, b) {
    const curPer  = getEpicProgressPercentage(a.key);
    const nextPer = getEpicProgressPercentage(b.key);
    if (curPer < nextPer) return 1;
    if (curPer > nextPer) return -1;
    return 0;
}

function comparatorBlockingRelation(a, b, list, i = 0, forwards = undefined) {
    if (i > 1000) return 0;
    if (!a || !b) return 0;
    if (a.key === b.key) return 0;

    const issueLinksA = a.fields['issuelinks'].filter(item => item.type.name === 'Blocks');
    const issueLinksB = b.fields['issuelinks'].filter(item => item.type.name === 'Blocks');

    if (issueLinksA.length === 0 || issueLinksB.length === 0) return 0;
    if (issueLinksA.filter(item => item.outwardIssue && item.outwardIssue.key === b.key).length === 1) return -1;
    if (issueLinksA.filter(item => item.inwardIssue && item.inwardIssue.key === b.key).length === 1) return 1;

    const nextKeyA = issueLinksA.filter(item => item.outwardIssue).map(item => item.outwardIssue.key)[0];
    const nextKeyB = issueLinksB.filter(item => item.outwardIssue).map(item => item.outwardIssue.key)[0];
    const prevKeyA = issueLinksA.filter(item => item.inwardIssue).map(item => item.inwardIssue.key)[0];
    const prevKeyB = issueLinksB.filter(item => item.inwardIssue).map(item => item.inwardIssue.key)[0];

    if (nextKeyA && nextKeyA === prevKeyB) return -1;
    if (nextKeyB && nextKeyB === prevKeyA) return 1;

    if (nextKeyA && list && (forwards || forwards === undefined)) {
        // No direct correlation, try going through list recursively forwards from a
        const resForwardsA = comparatorBlockingRelation(list.filter(item => item.key === nextKeyA)[0], b, list, i + 1,
                                                        true);
        if (resForwardsA !== 0) return resForwardsA;
    }

    if (nextKeyB && list && (forwards === false || forwards === undefined)) {
        // No direct correlation, try going through list recursively forwards from b
        const resForwardsB = comparatorBlockingRelation(a, list.filter(item => item.key === nextKeyB)[0], list, i + 1,
                                                        false);
        if (resForwardsB !== 0) return resForwardsB;
    }

    return 0;
}

export async function moveIssuesToMatchList(currentOrderIssues, targetOrderIssues) {
    if (currentOrderIssues.length !== targetOrderIssues.length) {
        error('SORT', 'Lists must have same length', 'currentOrderIssues', currentOrderIssues, 'targetOrderIssues',
              targetOrderIssues);
    }

    for (const currentIssue of currentOrderIssues) {
        if (currentOrderIssues.indexOf(currentIssue) !== targetOrderIssues.indexOf(currentIssue)) {
            const issueToMoveAfter = targetOrderIssues[targetOrderIssues.indexOf(currentIssue) - 1];
            /* if ((currentOrderIssues.indexOf(issueToMoveAfter) - currentOrderIssues.indexOf(currentIssue)) > 50) {
             await rankIssueBefore(currentOrderIssues[currentOrderIssues.indexOf(currentIssue) + 50].key,
             [issueToMoveAfter.key]);
             return true;
             }*/
            let issuesToMove = [...currentOrderIssues];
            issuesToMove     = issuesToMove.filter(
                item => currentOrderIssues.indexOf(item) < currentOrderIssues.indexOf(issueToMoveAfter));
            issuesToMove     = issuesToMove.filter(
                item => targetOrderIssues.indexOf(item) > targetOrderIssues.indexOf(issueToMoveAfter));
            issuesToMove     = issuesToMove.slice(0, 50);

            await rankIssueAfter(issueToMoveAfter.key, issuesToMove.map(item => item.key));
            return true;
        }
    }
    return false;
}

// ****** TEST SETUP ******
export const _testing_sorting               = {};
_testing_sorting.comparatorBlockingRelation = comparatorBlockingRelation;
