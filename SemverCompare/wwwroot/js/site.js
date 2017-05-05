angular.module('semverCompareApp', [])
    .controller('SemverCompareController',
    function ($http) {

            var semverCompare = this;
            semverCompare.versions = [{ version: "1.0.0" }];
            semverCompare.add = function() {
                semverCompare.versions.push({ version: "" });
            }
            semverCompare.remove = function(index) {
                semverCompare.versions.splice(index, 1);
            }
            semverCompare.compare = function () {
                var versions = [];
                for (var i = 0; i < semverCompare.versions.length; i++) {
                    versions.push(semverCompare.versions[i].version);
                }
                var qry = "?versions=" + versions.join("&versions=");
                $http.get("/Home/CompareVersions" + qry).then(function(result) {
                    semverCompare.report = result.data;
                });
            }

        });
