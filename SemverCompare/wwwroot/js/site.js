(function () {

    /**
     * The controller for the semver compare app
     * @param {any} $scope
     * @param {any} $http
     */
    function semverCompareController($scope, $http, hotkeys, initVersions) {
        var semverCompare = this;
        semverCompare.versions = [];
        
        function syncQueryString(qry) {            
            if (history.pushState) {
                var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + qry;
                window.history.pushState({ path: newurl }, '', newurl);
            }
        }

        semverCompare.add = function () {
            semverCompare.versions.push({ version: "" });
        }
        semverCompare.remove = function (index) {
            if (semverCompare.versions.length > 1) {
                semverCompare.versions.splice(index, 1);
            }            
        }
        semverCompare.compare = function () {
            var encodedVersions = [];
            //we need to double encoded because of the stupid '+' symbol in querystrings and extracting the raw literal
            var doubleEncodedVersions = [];
            for (var i = 0; i < semverCompare.versions.length; i++) {
                encodedVersions.push(encodeURIComponent(semverCompare.versions[i].version));
                doubleEncodedVersions.push(encodeURIComponent(encodedVersions[encodedVersions.length - 1]));
            }
            var encodedQuery = "?version=" + encodedVersions.join("&version=");
            var doubleEncodedQuery = "?version=" + doubleEncodedVersions.join("&version=");

            syncQueryString(doubleEncodedQuery);

            $http.get("/Home/CompareVersions" + encodedQuery).then(function (result) {
                semverCompare.report = result.data;
            });
        }
        semverCompare.toggleHelp = function () {
            hotkeys.toggleCheatSheet();
        }

        hotkeys.bindTo($scope).add({
            combo: ['alt+a'],
            description: 'Adds a row to compare',
            allowIn: ['INPUT'],
            callback: function (event, hotkey) {
                semverCompare.add();
            }
        });
        hotkeys.bindTo($scope).add({
            combo: ['alt+x'],
            description: 'Removes the current row',
            allowIn: ['INPUT'],
            callback: function (event, hotkey) {
                if (event.target.localName && event.target.localName === "input" && event.target.form) {
                    var inputs = event.target.form.getElementsByTagName("input");
                    for (var i = 0; i < inputs.length; i++) {
                        if (inputs[i] === event.target) {
                            semverCompare.remove(i);
                            return;
                        }
                    }
                }
            }
        });

        //initialize:
        if (initVersions.length > 0) {
            for (var i = 0; i < initVersions.length; i++) {
                semverCompare.versions.push({ version: decodeURIComponent(initVersions[i]) });
            }
        }
        else {
            semverCompare.versions.push({ version: "1.0.0" });
        }

        if (semverCompare.versions.length > 1) {
            semverCompare.compare();
        }
    }

    /**
     * A directive to auto focus an element when it is added to the DOM
     * @param {any} $timeout
     */
    function autoFocusDirective($timeout) {
        return function (scope, elem, attr) {
            $timeout(function () {
                if (elem.length > 0)
                    elem[0].focus();
            });
        };
    }

    var app = angular.module('semverCompareApp', ["cfp.hotkeys"])
        .controller('SemverCompareController', semverCompareController)
        .directive('autoFocus', autoFocusDirective);

    //Call a document callback if defined, this is sort of a dodgy hack to
    // be able to configure angular values in the cshtml file
    if (angular.isFunction(document.angularReady)) {
        document.angularReady.apply(this, [app]);
    }

})();

