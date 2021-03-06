function CONSTS(type) {
    return {
        feebas: {
            'background-image': 'url("https://github.com/timzatko/feebas/blob/master/packages/desktop_app/src/favicon.256x256.png?raw=true")',
            'background-repeat': 'no-repeat',
            'background-size': 'contain',
            'background-origin': 'content-box',
            'padding': '4px',
            width: '40px',
            height: '40px',
            'border-radius': '50%',
            border: '1px solid #1aaa55',
            'box-sizing': 'border-box',
            'background-color': 'transparent',
        },

        prod: {
            'background-color': 'red',
            color: 'white',
            'border-radius': '3px',
            display: 'inline-block',
            padding: '0 4px 0 2px',
        },

        qa: {
            'background-color': 'yellow',
            color: 'black',
            'border-radius': '3px',
            display: 'inline-block',
            padding: '0 4px 0 2px',
        },

        upvoteIcon: {
            color: 'green',
            position: 'absolute',
            right: '280px',
            top: '11px',
            'margin-right': '0',
        },

        downvoteIcon: {
            color: 'red',
            position: 'absolute',
            right: '330px',
            top: '11px',
            'margin-right': '0',
        },

        conflictIcon: {
            color: 'red',
            position: 'absolute',
            right: '40px',
            top: '13px',
        },

        authorPhoto: {
            'margin-top': '10px',
            display: 'block',
            width: '24px',
            height: '24px',
            'background-color': 'gray',
            'background-size': 'contain',
            'border-radius': '50%',
            'margin-right': '15px',
            overflow: 'hidden',
        },

        authorPhotoHTML: '<div class="monar-author-photo"><div style="width: 100%; height: 100%; background-size: contain;"></div></div>',

        reviewerPhoto: {
            width: '24px',
            height: '24px',
        },

        reviewerWrapper: {
            position: 'absolute',
            right: '70px',
            top: '8px',
        },

        pipelineWrapper: {
            position: 'absolute',
            right: '15px',
            'margin-right': 0,
            top: '12px',
        },

        commentsWrapper: {
            position: 'absolute',
            right: '200px',
            top: '11px',
        },

        updatedAtWrapper: {
            position: 'absolute',
            opacity: '0.5',
            right: '15px',
            bottom: '8px',
        },

        titleBase: {
            color: 'rgb(0, 82, 204)',
            'font-weight': 'normal',
        },

        statusWrapper: {
            position: 'absolute',
            right: '100px',
            top: '11px',
        },

        approvedBg: {
            'background-color': 'rgba(105, 209, 0, 0.05)',
        },
    }[type];
}

function parseHtmlPullRequests() {
    const pullRequests = [];

    $('li.merge-request').each(function() {
        const element = $(this);

        const titleElement = $('.merge-request-title-text a', element);
        const idElement = $('.issuable-reference', element);
        const authorElement = $('.issuable-info .author-link', element);
        const targetElement = $('.project-ref-path .ref-name', element);
        const conflictElement = $('.issuable-pipeline-broken a', element);
        const upvoteElement = $('.issuable-upvotes', element);
        const downvoteElement = $('.issuable-downvotes', element);
        const commentsElement = $('.issuable-comments', element);
        const approveElement = $('.issuable-info .badge:contains("approved")', element);
        const reviewerElement = $('.issuable-meta .author-link', element);
        const pipelineElement = $('.issuable-pipeline-status', element);
        const updatedAtElement = $('.issuable-updated-at', element);
        const statusElement = $('.issuable-status', element);

        if (!titleElement.data('monar-title')) {
            titleElement.data('monar-title', titleElement.text().trim());
        }

        pullRequests.push({
            element,

            titleElement,
            title: titleElement.data('monar-title'),

            idElement,
            id: idElement.text().trim().substring(1),

            authorElement,
            author: {
                username: authorElement.data('username').trim(),
                name: authorElement.data('name').trim(),
                id: authorElement.data('userId'),
            },

            targetElement,
            target: targetElement.text().trim(),

            conflictElement,
            hasConflict: conflictElement[0],

            upvoteElement,
            upvoteCount: upvoteElement.text().trim(),
            isUpvoted: upvoteElement.text().trim() > 0,

            downvoteElement,

            commentsElement,
            commentsCount: commentsElement.text().trim(),

            approveElement,
            isApproved: approveElement[0],

            statusElement,
            status: statusElement.text().trim(),

            reviewerElement,
            pipelineElement,
            updatedAtElement,
        });
    });

    return pullRequests;
}

function formatPullRequest(request) {
    const projectId = getProjectId();

    // Target
    if (request.target === 'prod') {
        request.targetElement.css(CONSTS('prod'));
    } else if (request.target === 'qa') {
        request.targetElement.css(CONSTS('qa'));
    }

    // Author photo
    let authorPhoto = $('.monar-author-photo', request.element);
    if (!authorPhoto[0]) {
        $('.issuable-info-container', request.element).prepend(CONSTS('authorPhotoHTML'));
        authorPhoto = $('.monar-author-photo', request.element);
    }
    authorPhoto.css(CONSTS('authorPhoto'));
    authorPhoto.css('background-image', `url(${window['monar_GLOBALS'].defaultAvatar})`);
    $('div', authorPhoto).css('background-image', `url('/uploads/-/system/user/avatar/${request.author.id}/avatar.png?width=44')`);

    // Title modifications
    request.titleElement.css(CONSTS('titleBase'));
    let title = request.title;
    title = title.replace(/^Resolve/g, '');
    title = title.replace(/(APP-\d*)/g, '<b>$1</b>');
    title = title.replace(/(APPT-\d*)/g, '<b>$1</b>');
    title = title.replace(/(CMP-\d*)/g, '<b>$1</b>');
    title = title.replace(/(DB-\d*)/g, '<b>$1</b>');
    title = title.replace(/(FIX)/g, '<b>$1</b>');
    title = title.replace(/(QA-\d*)/g, '<b>$1</b>');
    title = title.replace(/(SEC-\d*)/g, '<b>$1</b>');
    title = title.replace(/(DP-\d*)/g, '<b>$1</b>');
    title = title.replace(/(PRED-\d*)/g, '<b>$1</b>');
    title = title.replace(/(FRON-\d*)/g, '<b>$1</b>');
    title = title.replace(/(WE-\d*)/g, '<b>$1</b>');
    title = title.replace(/(ANL-\d*)/g, '<b>$1</b>');
    title = title.replace(/\[([^\]]+)\]/ig, '<b style="background-color: rgba(0,255,255,0.5); color: black;">[$1]</b>');
    title = title.replace(/WIP(:?)/g, '<b style="color: red;">WIP$1</b>');
    request.titleElement.html(title);

    // Upvoted
    if (request.isUpvoted) {
        request.upvoteElement.css(CONSTS('upvoteIcon'));
    }
    if (request.downvoteElement[0]) {
        request.downvoteElement.css(CONSTS('downvoteIcon'));
    }

    // Conflict
    if (request.hasConflict) {
        request.conflictElement.css(CONSTS('conflictIcon'));
    }

    // Approved
    if (request.isApproved) {
        request.element.css(CONSTS('approvedBg'));
    }

    // Reviewer
    if (request.reviewerElement[0]) {
        $('img', request.reviewerElement).css(CONSTS('reviewerPhoto'));
        request.reviewerElement.css(CONSTS('reviewerWrapper'));
    }

    // Pipeline
    if (request.pipelineElement[0]) {
        request.pipelineElement.css(CONSTS('pipelineWrapper'));
    }

    // Comments
    if (request.commentsCount < 1) {
        request.commentsElement.remove();
    } else {
        request.commentsElement.css(CONSTS('commentsWrapper'));
    }

    // Updated at
    if (request.updatedAtElement[0]) {
        request.updatedAtElement.css(CONSTS('updatedAtWrapper'));
    }

    // Status (merged / closed)
    if (request.statusElement[0]) {
        request.statusElement.css('color', request.status === 'MERGED' ? 'green' : 'red');
        request.statusElement.css(CONSTS('statusWrapper'));
    }

    // Line

    if (projectId !== null) {
        // Unresolved discussions
        let unresolved = 0;
        $.ajax(`/api/v4/projects/${projectId}/merge_requests/${request.id}/discussions`)
            .then(function(data) {
                (data || []).forEach(function (item) {
                    if (item.notes && item.notes[0]) {
                        const note = item.notes[0];
                        if (note.resolvable && !note.resolved) {
                            unresolved++;
                        }
                    }
                });

                if (unresolved > 0) {
                    $('a', request.commentsElement).prepend(`<span style="color: red;"><i aria-hidden="true" data-hidden="true" class="fa fa-crosshairs"></i><span>${unresolved}</span></span>&nbsp;&nbsp;&nbsp;`);
                }
            })
            .catch(function(x) {
                console.log(x.responseJSON);
            });


        // Approvals
        $.ajax(`/api/v4/projects/${projectId}/merge_requests/${request.id}/approvals`)
            .then(function(data) {

                (data.approved_by || []).forEach(function(item, index) {
                    item = item.user;
                    // Author photo
                    const className = `monar-approve-photo-${item.id}`;

                    const html = `<div class="${className}"><div style="width: 100%; height: 100%; background-size: contain;"></div></div>`;
                    const css = {
                        display: 'block',
                        width: '24px',
                        height: '24px',
                        'background-color': 'gray',
                        'background-size': 'contain',
                        'border-radius': '50%',
                        overflow: 'hidden',
                        border: '2px solid #69D100',
                        position: 'absolute',
                        top: '34px',
                        right: (index * 30) + 215 + 'px',
                    };

                    let approvePhoto = $('.' + className, request.element);
                    if (!approvePhoto[0]) {
                        $('.issuable-info-container', request.element).prepend(html);
                        approvePhoto = $('.' + className, request.element);
                    }
                    approvePhoto.css(css);
                    approvePhoto.css('background-image', `url(${window['monar_GLOBALS'].defaultAvatar})`);
                    $('div', approvePhoto).css('background-image', `url('${item.avatar_url}?width=44')`);
                    $('div', approvePhoto).attr('title', item.name);
                    request.element.css(CONSTS('approvedBg'));
                });
            })
            .catch(function(x) {
                console.log(x.responseJSON);
            });
    }
}

function prettifyPullRequestPage() {
    if (!isPullRequestsListPage()) {
        return;
    }

    if ($('#monar-styles').length === 0) {
        const css = `<style id="monar-styles">.remove-before::before{display: none !important;} .remove-after::after{display: none !important;}</style>`;
        document.head.insertAdjacentHTML('beforeEnd', css);
    }

    // Approvals
    $('.approvals-required-text.text-muted').remove();

    // Remove "You can merge this merge request manually using the  command line"
    $('.mr-section-container.mr-widget-workflow .mr-widget-footer').remove();

    // Remove text in pipeline info
    $('.mr-widget-heading.mr-widget-workflow .ci-widget-content').remove();

    // Redesign pipeline info
    $('.mr-state-widget.prepend-top-default').css('position', 'relative');
    const pipelineWrap = $('.ci-widget.media').closest('.mr-widget-heading.mr-widget-workflow');
    pipelineWrap.css({
        position: 'absolute',
        right: '70px',
        top: '-15px',
        border: 'none',
    });
    $('.ci-widget-container', pipelineWrap).insertBefore($('.align-self-start', pipelineWrap));
    $('.align-self-start', pipelineWrap).css({
        'margin-left': '15px',
        'margin-right': 0,
    });
    pipelineWrap.addClass('remove-before');

    // Cleanup first box
    $('.diverged-commits-count').contents().filter(function() {
        return (this.nodeType == 3);
    }).remove();
    $('.diverged-commits-count').css('font-size', '10px');

    $('.git-merge-container .normal strong').contents().filter(function() {
        return $(this).text().trim() === 'Request to merge';
    }).remove();

    // Move "Check out branch"
    $('.js-check-out-branch').insertAfter($('.branch-actions ul.dropdown-menu li:last-child'));
    $('.js-check-out-branch').removeClass('btn');
    $('.js-check-out-branch').wrap('<li></li>');

    // Move "Open in Web IDE"
    $('.js-web-ide').insertAfter($('.branch-actions ul.dropdown-menu li:last-child'));
    $('.js-web-ide').removeClass('btn');
    $('.js-web-ide').wrap('<li></li>');
    $('.branch-actions ul.dropdown-menu').css('overflow', 'hidden');

    // Assign myself
    let assignButtonElement = $('#monar-assign-btn');
    if (assignButtonElement.length === 0) {
        const assignButton = `<a id="monar-assign-btn" href="#" style="position: absolute; right: 0; top: 20px; color: rgb(0, 82, 204);"></a>`;
        $('.breadcrumbs-list').after($(assignButton));
        assignButtonElement = $('#monar-assign-btn');
    }
    assignButtonElement.off('click');
    const assignedToYou = parseInt($('.block.assignee input[type=hidden]').val()) === window['monar_GLOBALS'].id;
    assignButtonElement.html(assignedToYou ? 'Unassign me' : 'Assign me');
    assignButtonElement.click(function() {
        $.ajax({
            url: `/${window.gl.mrWidgetData.source_project_full_path}/merge_requests/${window.gl.mrWidgetData.iid}.json`,
            type: 'PUT',
            data: { merge_request: { assignee_id: assignedToYou ? '0' : window['monar_GLOBALS'].id } },
            success: function(result) {
                location.reload();
            },
        });
    });

    // Emotes
    $('.emoji-list-container').css('opacity', 0.1).css('border-bottom', 'none');
    $('.emoji-list-container').mouseenter(function() {
        $(this).css('opacity', 1);
    }).mouseleave(function() {
        $(this).css('opacity', 0.1);
    });

    // Feebas - main
    if (isFrontend()) {
        if ($('#monar-feebas-main').length === 0) {
            const href = `feebas://app:${window.gl.mrWidgetData.diff_head_sha}`;
            $('.mr-state-widget.prepend-top-default').append(`<a title="Open in Feebas" id="monar-feebas-main" href="${href}"></a>`);
            $('#monar-feebas-main').css(CONSTS('feebas'));
            $('#monar-feebas-main').css({ position: 'absolute', right: '0px', top: '-45px' });
            $('#monar-feebas-main').mouseenter(function() {
                $(this).css('background-color', '#1aaa55');
            }).mouseleave(function() {
                $(this).css('background-color', 'transparent');
            });
        }

        // Feebas - commits
        const feebasInterval = setInterval(function() {
            if ($('#commits-list').length !== 0) {
                clearInterval(feebasInterval);

                $('#commits-list li .commit-actions').each(function() {
                    const element = $(this);
                    const commitId = $('[data-title="Copy commit SHA to clipboard"]', element).data('clipboard-text');
                    const id = `monar-feebas-${commitId}`;
                    const href = `feebas://app:${commitId}`;
                    element.append(`<a title="Open in Feebas" id="${id}" href="${href}"></a>`);
                    $('#' + id).css(CONSTS('feebas'));
                    $('#' + id).css('margin-left', '15px');

                    $('#' + id).mouseenter(function() {
                        $(this).css('background-color', '#1aaa55');
                    }).mouseleave(function() {
                        $(this).css('background-color', 'transparent');
                    });
                });
            }
        }, 500);
    }

    // Remove errors
    setInterval(function() {
        $('.err').removeClass('err');
    }, 500);
}

function prettifyCommitList() {
    // Feebas - main
    if (isFrontend()) {
        if ($('#commits-list').length !== 0) {
            const feebasInterval = setInterval(function() {
                clearInterval(feebasInterval);

                $('#commits-list li .commit-actions').each(function() {
                    const element = $(this);
                    const commitId = $('[data-title="Copy commit SHA to clipboard"]', element).data('clipboard-text');
                    const id = `monar-feebas-${commitId}`;
                    const href = `feebas://app:${commitId}`;
                    element.append(`<a title="Open in Feebas" id="${id}" href="${href}"></a>`);
                    $('#' + id).css(CONSTS('feebas'));
                    $('#' + id).css('margin-left', '15px');

                    $('#' + id).mouseenter(function() {
                        $(this).css('background-color', '#1aaa55');
                    }).mouseleave(function() {
                        $(this).css('background-color', 'transparent');
                    });
                });
            }, 500);
        }
    }
}

function prettifyCreatePullRequestPage() {
    const titleElement = document.querySelector('.form-control.qa-issuable-form-title');
    if (titleElement) {
        const titleRegex = /Resolve (.*?) \"(.*?)\"/g;
        const titleRegexMatch = titleRegex.exec(titleElement.value);
        if (titleRegexMatch && titleRegexMatch.length === 3) {
            titleElement.value = `${titleRegexMatch[1]} ${titleRegexMatch[2]}`;
        }
    }

    let $titleRow = $('#merge_request_title').closest('.form-group.row');
    $('#merge_request_target_branch').closest('.form-group.row').clone().insertBefore($titleRow);
}

function addBadges() {
    if (isPullRequestViewPage()) {
        return;
    }

    if (true || isFrontend() && window['monar_GLOBALS'].projectId) {
        const latest = Promise.all([
            fetchPipelineData({ref: 'prod'}).then(data => (data || [{}])[0]),
            fetchPipelineData({ref: 'qa'}).then(data => (data || [{}])[0]),
            fetchPipelineData({ref: 'master'}).then(data => (data || [{}])[0]),
        ]).then(data => ({prod: data[0], qa: data[1], master: data[2]}));

        const nightly = fetchPipelineData({username: window['monar_GLOBALS'].internalUsername})
            .then(data => {
                let prod, qa, master;
                for (let i = 0; i < (data || []).length; i++) {
                    const item = data[i];
                    if (item.ref === 'master' && !master) {
                        master = item;
                    }
                    if (item.ref === 'qa' && !qa) {
                        qa = item;
                    }
                    if (item.ref === 'prod' && !prod) {
                        prod = item;
                    }
                    if (master && qa && prod) {
                        break;
                    }
                }

                return {prod: prod || {}, qa: qa || {}, master: master || {}};
            });

        const latestTag = $.ajax(`/api/v4/projects/${window['monar_GLOBALS'].projectId}/repository/tags`).then(data => (data || [{}])[0]);

        Promise.all([latest, nightly, latestTag]).then(data => ({latest: data[0], nightly: data[1], tag: data[2]}))
            .then(data => {
                if ($('#monar-pipelines-global').length === 0) {
                    let badges = '';

                    badges += `<a style="vertical-align: top; display: inline-block; margin-right: 40px;" href="${window.monar_GLOBALS.project}/commit/${data.tag.commit.id}">
                            <img src="https://img.shields.io/badge/latest tag-${data.tag.name}-green.svg"></img>
                        </a>`

                    badges += '<table style="display: inline-block">';
                    (isFrontend() ? ['nightly', 'latest'] : ['latest']).forEach(function (time) {
                        badges += `<tr><td style="text-align: right;"><img src="${getBadgeUrl(time, '')}"></img></td>`;            
                        ['prod', 'qa', 'master'].forEach(function (branch) {
                            badges += `<td style="padding-left: 10px; text-align: center;">
                                <a href="${data[time][branch].web_url}">
                                    <img src="${getBadgeUrl(data[time][branch].status, branch)}"></img>
                                </a>
                            </td>`;
                        });
                        badges += '</tr>';
                    });
                    badges += '</table>';
            
                    $('nav.breadcrumbs .breadcrumbs-container').append(`
                        <div style="position: absolute; right: 0; top: -1px;" id="monar-pipelines-global">
                            ${badges}
                        </div>`);
                }
            });
    }

    function fetchPipelineData(data) {
        return $.ajax({
            url: `/api/v4/projects/${window['monar_GLOBALS'].projectId}/pipelines`,
            data: data,
        });
    }

    function getBadgeUrl(status, text) {
        const color = {
            running: 'blue',
            pending: 'blue',
            success: 'brightgreen',
            failed: 'red',
            canceled: 'lightgrey',
            skipped: 'lightgrey',
            nightly: 'orange',
            latest: 'orange',
            undefined: 'lightgrey',
        }[status];

        const statusWord = {
            running: 'running',
            pending: 'pending',
            success: 'passed',
            failed: 'failed',
            canceled: 'canceled',
            skipped: 'skipped',
            nightly: 'nightly',
            latest: 'latest',
            undefined: 'unknown',
        }[status];

        return `https://img.shields.io/badge/${text}-${statusWord}-${color}.svg`;
    }
}

function isFrontend() {
    return window.monar_GLOBALS.project === '/app/frontend';
}

function getProjectId() {
    return $('#search_project_id')[0] ? $('#search_project_id')[0].value : null;
}

function isPullRequestsListPage() {
    if ($('div.merge-request').length !== 1) {
        return false;
    }

    return true;
}

function isPullRequestViewPage() {
    if ($('#content-body .merge-request .merge-request-details').length !== 1) {
        return false;
    }

    return true;
}

setTimeout(function() {
    window['monar_GLOBALS'] = {
        id: gon.current_user_id,
        username: gon.current_username,
        name: gon.current_user_fullname,
        avatar: gon.current_user_avatar_url,
        defaultAvatar: gon.default_avatar_url,

        project: 
            window.gl.projectOptions[Object.keys(window.gl.projectOptions)[0]].issuesPath 
            ? window.gl.projectOptions[Object.keys(window.gl.projectOptions)[0]].issuesPath.replace('/issues', '') 
            : '',
        projectId: getProjectId(),

        internalUsername: 'user.of.system',
    };
    
    if (window['monar_GLOBALS'].project) {
        parseHtmlPullRequests().forEach(formatPullRequest);
        prettifyPullRequestPage();
        prettifyCommitList();
        prettifyCreatePullRequestPage();
        addBadges();
    }
}, 0);

