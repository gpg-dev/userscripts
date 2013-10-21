// ==UserScript==
// @name          YouTube Sidebar: Hide Recommended Videos
// @description   Remove "Recommended for you" videos from the sidebar on YouTube video pages
// @author        chocolateboy
// @copyright     chocolateboy
// @namespace     https://github.com/chocolateboy/userscripts
// @version       1.1.0
// @license       GPL: http://www.gnu.org/copyleft/gpl.html
// @include       http://www.youtube.com/watch*
// @include       http://youtube.com/watch*
// @include       https://www.youtube.com/watch*
// @include       https://youtube.com/watch*
// @require       https://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.js
// @grant         none
// ==/UserScript==

/*
 * @requires:
 *
 * jQuery 2.0.3
 *
 *     https://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.js
 */

var NAVIGATE_PROCESSED = 'navigate-processed-callback';

/* recommended videos can be distinguished by the fact that
 * they have two attribution spans, rather than the usual one
 *
 *     <li class="related-list-item">
 *         <a href="/watch?v=1234xyz" class="spf-link">
 *             <span class="attribution">
 *                 by <span class="yt-user-name">username</span>
 *             </span>
 *             ...
 *             <span class="attribution">Recommended for you</span>
 *         </a>
 *     </li>
 */
function hide_recommended() {
    $('li.related-list-item').has('span.attribution:eq(1)').hide();
}

// execute as late as possible
$(window).on('load', function() {
    hide_recommended();

    // handle AJAX page loads by wrapping the callback
    // the SPF (single page framework?) module fires after
    // the content for a new page has been retrieved and processed
    var spf_config = (unsafeWindow || window)._spf_state.config;
    var old_callback = spf_config[NAVIGATE_PROCESSED];

    spf_config[NAVIGATE_PROCESSED] = function() {
        var rv;

        if (old_callback) {
            try {
                rv = old_callback.apply(null, arguments);
            } catch (e) {
                rv = e;
            }
        }

        hide_recommended();

        // the return value isn't currently used, but it may be in future
        return rv;
    };
});
