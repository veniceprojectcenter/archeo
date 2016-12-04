var config = {
    apiKey: "AIzaSyAayzA-CyhlQFfs02PadKScL9FJEIwbqmQ",
    authDomain: "ve16archeo-prototypedatabase.firebaseapp.com",
    databaseURL: "https://ve16archeo-prototypedatabase.firebaseio.com",
    storageBucket: "ve16archeo-prototypedatabase.appspot.com",
    messagingSenderId: "979534883195"
};

var fb = firebase.initializeApp(config);

(function() {
    'use strict';
    var app = angular.module('app',['firebase']);

    angular.module('app').controller('ArchCtrl', function($scope, $firebaseObject) {
        var bc = this;
        bc.sites = {};
        bc.layers = [];
        var previousRef;

        firebase.database().ref()
            .child("groups")
            .child("Site")
            .child('members')
            .on('value', function(siteIDs) {
                var res = siteIDs.val();
                Object.keys(res).forEach(function(key){
                    bc.sites[key] = key;
                });
                $scope.$apply();
                Object.keys(bc.sites).forEach(function(key){
                    firebase.database().ref()
                        .child("data")
                        .child(key)
                        .on('value', function(site){
                            //Adding all the sites to the sites[] array
                            bc.sites[key] = site.val()['data']['Common name'];
                            $scope.$apply();
                        });
                });
            });

        $scope.$on('$includeContentLoaded', function () {
            initApp();
        });

        bc.index = function(){
            bc.unbind();
            bc.hideAll();
            $('#index').show();
        };

        bc.showSite = function(site_id){
            bc.unbind();
            bc.hideAll();
            $('#show').show();
            console.log(site_id);

            //Finding the key that was found in "groups" for the site inside "data"
            bc.site_ref = firebase.database().ref()
                .child('data')
                .child(site_id)
                .child('data');
            bc.site_info = $firebaseObject(bc.site_ref);
            previousRef = bc.site_info;

            //Doing the same for the layers
            bc.site_ref.child('layers').on('value', function(layers_list){
                bc.layer_keys = Object.keys(layers_list.val());
                bc.layers = {};
                bc.layer_ref = {};
                bc.layer_keys.forEach(function(lk){
                    bc.layer_ref[lk] = firebase.database().ref()
                        .child('data')
                        .child(lk)
                        .child('data');
                    bc.layers[lk] = $firebaseObject(bc.layer_ref[lk]);
                    bc.layers[lk].$bindTo($scope, "layers[" + lk + "]");
                });
            });
            // synchronize the object with a three-way data binding
            // click on `index.html` above to see it used in the DOM!
            bc.site_info.$bindTo($scope, "site");
        };

        /*
        Edits an existing layer
         */
        bc.editLayer = function(layer_id){
            bc.unbind();
            bc.hideAll();
            $('#edit').show();
            setUpCategoryClicks(); // from edit.js
            if (layer_id) { // TODO: send site_id from index to show and from show to bc.editSite(site_id)
                bc.layer_id = layer_id;
                bc.layer_ref = firebase.database().ref()
                    .child('data')
                    .child(layer_id)
                    .child('data');
                bc.layer_info = $firebaseObject(bc.layer_ref);
                previousRef = bc.layer_info;
                // synchronize the object with a three-way data binding
                // click on `index.html` above to see it used in the DOM!
                bc.layer_info.$bindTo($scope, "layer");
            }
        };


        /**
         **  Adds a new layer to the database.
         **  Generates a new key, and adds itself to the site it belongs to.
         **/
        bc.addLayer = function(){
            var us =  Object.keys(bc.layers).length + 100;
            var groupName = 'Layers';

            // CREATE NEW KEY
            var newLayerKey = firebase.database().ref().child('data').push().key;
            console.log("New Key", newLayerKey);
            var newLayer = {us: us};
            bc.layers.push({newLayer});
            // save birth_certificate
            firebase.database().ref().child('data').child(newLayerKey).update({
                birth_certificate: {
                    birthID: newLayerKey,
                    ckID: newLayerKey,
                    // dor: (new Date()),
                    recorder: 'Natasha',
                    type: groupName
                },
                data: {
                    ckID: newLayerKey,
                    site_id: bc.site_id,
                    us: us
                }
            }).then(function(){
                // add element to group
                firebase.database().ref().
                child('groups').
                child(groupName).
                child('members').
                child(newLayerKey).
                set(newLayerKey);

                // add kayer to site
                firebase.database().ref().
                child('data').
                child(bc.site_id).
                child('data').
                child('USlayers').
                child(newLayerKey).
                update({
                    site_ckId: newLayerKey,
                    name: "newLayer"
                });
            });
        };

        bc.editFind = function(find_id){
            bc.unbind();
            bc.hideAll();
            $('#edit').show();
            setUpCategoryClicks(); // from edit.js

            if (find_id) { // TODO: send layer_id from index to show and from show to bc.editSite(site_id)
                bc.layer_id = layer_id;
                bc.layer_ref = firebase.database().ref()
                    .child('data')
                    .child(layer_id)
                    .child('data');
                bc.layer_info = $firebaseObject(bc.layer_ref);
                previousRef = bc.layer_info;
                // synchronize the object with a three-way data binding
                // click on `index.html` above to see it used in the DOM!
                bc.layer_info.$bindTo($scope, "layer");
            }
        };


        /**
         **  Adds a new find to the database.
         **  Generates a new key, and adds itself to the layer it belongs to.
         **/
        bc.addFind = function(type){

            // CREATE NEW KEY
            var newFindKey = firebase.database().ref().child('data').push().key;
            console.log("New Key", newFindKey);

            // save birth_certificate
            firebase.database().ref().child('data').child(newFindKey).update({
                birth_certificate: {
                    birthID: newFindKey,
                    ckID: newFindKey,
                    // dor: (new Date()),
                    recorder: 'Natasha',
                    type: type
                },
                data: {
                    ckID: newFindKey,
                    layer_id: bc.layer_id
                }
            }).then(function(){
                // add element to group
                firebase.database().ref().
                child('groups').
                child(type).
                child('members').
                child(newFindKey).
                set(newFindKey);

                // add find to layer
                firebase.database().ref().
                child('data').
                child(bc.layer_id).
                child('data').
                child('finds').
                child(newFindKey).
                update({
                    find_ckId: newFindKey,
                    name: "newFind"
                });
            });
        };

        bc.hideAll = function() {
            $('#index').hide();
            $('#edit').hide();
            $('#show').hide();
        };

        bc.unbind = function() {
            /*
             unbind fireAngular and inputs from the previousRef.
             */

            if (previousRef) { // undbind
                previousRef.$destroy();
            }
        }

        bc.layers = [];
        //Adding a new layer to the matrix
        bc.addLayer = function() {
            var us =  Object.keys(bc.layers).length + 100;
            console.log(us);
            //TODO:Generate keys and info for layers when implementing firebase
            var newLayer = {us: us};
            bc.layers.push({newLayer});
        }

        //TODO Talk
        bc.removeLayer = function (id) {
            console.log("Removing layer", id);
            bc.layers.splice(id-100,1);
            for(i=0;i<bc.layers.length; i++){
                bc.layers[i].us = i+100;
            }

        }
    });
})();
