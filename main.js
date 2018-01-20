var GITHUB_REPOSITORIES_URL = "https://api.github.com/user/repos?visibility=all";
var GITHUB_REPO_BASE_URL = "https://api.github.com/repos/";

function makeRepositoryIssuesUrl(hash) {
    return "https://api.github.com/repos/" + hash.substring(1) + "/issues";
}

function github_GET(url, callback) {
    var request = new XMLHttpRequest();
    var auth_basic = window.btoa($("#username input").val() + ":" + $("#api-key input").val());
    request.open("GET", url, true);
    request.setRequestHeader("Authorization", "Basic " + auth_basic);
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            callback(JSON.parse(request.responseText));
        }
    };
    request.send(null);
}
function github_POST(data, url, callback) {
    var request = new XMLHttpRequest();
    var auth_basic = window.btoa($("#username input").val() + ":" + $("#api-key input").val());
    request.open("POST", url, true);
    request.setRequestHeader("Authorization", "Basic " + auth_basic);
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 201) {
            callback(JSON.parse(request.responseText));
        }
    };
    request.send(data);
}

function makeLink(address, name) {
    return "<a href=\"" + address + "\">" + name + "</a>";
}
function makeLinkOpenInNewTab(address, name) {
    return "<a href=\"" + address + "\" target=\"_blank\">" + name + "</a>";
}
function getDataForRepository(repo_entry) {
    return makeLink("#" + repo_entry["full_name"], repo_entry["name"]);
}
function makeTableRows(json_data, data_parsing_func) {
    var newhtml = "";
    for (var entry of json_data) {
        newhtml += "<tr><td>" + data_parsing_func(entry) + "</td></tr>";
    }
    return newhtml;
}

function makeIssueInputField() {
    return "<tr><td><input id=\"new-issue-title\" type=\"text\" placeholder=\"New issue Title\" /><input id=\"new-issue-body\" type=\"text\" placeholder=\"Details (Optional)\" /></td></tr>"
}

function showRepositories(repositories) {
    var elem = document.getElementById("repository-list");
    elem.innerHTML = makeTableRows(repositories, getDataForRepository);
}

function getDataForIssue(issue) {
    return makeLinkOpenInNewTab(issue["html_url"], issue["title"]);
}
function showIssuesForRepo(issues) {
    var elem = document.getElementById("issues-list");
    var newhtml = makeTableRows(issues, getDataForIssue);
    elem.innerHTML = newhtml + makeIssueInputField();
    $("#new-issue-title").bind("enterKey", createNewIssue);
    $("#new-issue-title").keyup(function (e) {
        if (e.keyCode == 13) {
            $(this).trigger("enterKey");
        }
    });
    $("#new-issue-body").bind("enterKey", createNewIssue);
    $("#new-issue-body").keyup(function (e) {
        if (e.keyCode == 13) {
            $(this).trigger("enterKey");
        }
    });

}

// Function specific to hiding the rows of a table
function filterRepos(e) {
    var string = $("#repo-filter input").val().toLowerCase();
    var repo;

    if (string.length > 0) {
        // which tag is captured will have to be changed, if the table is removed
        $("#repository-list tr").each(function (i, v) {
            if (v.children[0].children[0].text.indexOf(string) == -1) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    } else {
        $("#repository-list tr").show();
    }
}

function showIssues() {
    var repositoryUrl = makeRepositoryIssuesUrl(window.location.hash);
    github_GET(repositoryUrl, showIssuesForRepo);
}

$(document).on('keyup', "#repo-filter input", $.proxy(filterRepos, this));
$("#api-key").on('change', function () {
    github_GET(GITHUB_REPOSITORIES_URL, showRepositories);
});

$(window).on('hashchange', function () {
    if (window.location.hash.length > 1) {
        showIssues();
    }
});

function createNewIssue() {
    var data = {
        "title": $("#new-issue-title").val(),
        "body": $("#new-issue-body").val()
    };

    github_POST(JSON.stringify(data), makeRepositoryIssuesUrl(window.location.hash), function (response) {
        showIssues();
    });
}