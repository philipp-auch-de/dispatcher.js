import { callUrl } from '../jira/base.js';

export async function sendMail(issueKey, headline, message) {
    const body = JSON.stringify({
                                    subject:  headline,
                                    textBody: message,
                                    htmlBody: message,
                                    to:       {
                                        assignee: true,
                                    },
                                });

    await callUrl('POST', '/api/3/issue/' + issueKey + '/notify', body);
}
