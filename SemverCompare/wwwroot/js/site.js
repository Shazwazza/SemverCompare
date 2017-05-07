(function () {

    /**
     * The controller for the semver compare app
     * @param {any} $scope
     * @param {any} $http
     */
    function semverCompareController($scope, $http, hotkeys) {
        var semverCompare = this;
        semverCompare.versions = [{ version: "1.0.0" }];

        semverCompare.add = function () {
            semverCompare.versions.push({ version: "" });
        }
        semverCompare.remove = function (index) {
            if (semverCompare.versions.length > 1) {
                semverCompare.versions.splice(index, 1);
            }
        }
        semverCompare.compare = function () {
            var versions = [];
            for (var i = 0; i < semverCompare.versions.length; i++) {
                versions.push(semverCompare.versions[i].version);
            }
            var qry = "?versions=" + versions.join("&versions=");
            $http.get("/Home/CompareVersions" + qry).then(function (result) {
                semverCompare.report = result.data;
            });
        }
        semverCompare.toggleHelp = function() {
            hotkeys.toggleCheatSheet();
        }

        hotkeys.bindTo($scope).add({
            combo: ['alt+a'],
            description: 'Adds an row to compare',
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

    angular.module('semverCompareApp', ["cfp.hotkeys"])
        .controller('SemverCompareController', semverCompareController)
        .directive('autoFocus', autoFocusDirective);

})();

