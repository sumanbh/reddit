import snoowrap from 'snoowrap';
import config from '../../dev.json';

const reddit = new snoowrap({
    userAgent: config.USER_AGENT,
    clientId: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
    refreshToken: config.REFRESH_TOKEN,
});
reddit.config({ debug: true });

module.exports = reddit;
