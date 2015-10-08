/*

post = {

    id: "15913gfq",
    url: "nodes/9xaib1v/posts/process/15913gfq",
    editable: true,

    blocks: [
        {
            type: "html",
            url: "nodes/9xaib1v/media/html/1591chpq",
            id: "1591cimg",
            allowed: ["modify", "delete"]
        },

        {
            type: "form",
            url: "data/entities/1591x70r",
            id: "1591x8p9",
            allowed: ["modify", "delete"]
        },

        {
            type: "html",
            url: "nodes/9xaib1v/media/html/15s1ibga",
            id: "15s1idb4",
            allowed: ["modify", "delete"]
        }
    ],

    insertable: {
        html: {
            endpoint: "nodes/9xaib1v/media/html"
        },

        video: {
            endpoint: "nodes/9xaib1v/media/videos"
        },

        form: {
            endpoint: "nodes/9xaib1v/data/entities"
        }
    }            
};

<phi-post ng-model="post"></phi-post>

*/


(function() {

    angular
        .module("phi.ui")
        .directive("phiPost", phiPost);


    function phiPost() {

        return {

            restrict: "E",

            scope: {
                ngModel: "="
            },

            controller:   phiPostController,
            controllerAs: "vm",

            template:   '<div class="phi-post">' + 

                            '<div class="phi-post-blocks" sv-root sv-part="vm.post.blocks" sv-on-sort="vm.reorder()">' + 

                                '<div ng-repeat="(key, block) in vm.post.blocks" ng-init="block.ctrl = {}" class="phi-block" sv-element>' + 

                                    '<div ng-show="vm.post.editable" class="phi-block-toolbar" sv-handle>' + 

                                        '<div class="phi-block-menu">' + 
                                            '<button ng-blur="block.menuShown = false" id="menu_toggler_{{post.id}}_{{key}}" ng-show="block.ctrl.currentAction == \'default\'" ng-click="block.menuShown = !block.menuShown" phi-icon="fa-ellipsis-v"></button>' + 
                                            '<button ng-blur="block.menuShown = false" ng-show="block.ctrl.currentAction != \'default\'" ng-click="block.ctrl.openAction()" phi-icon="fa-times"></button>' + 

                                            '<div phi-tooltip-for="menu_toggler_{{post.id}}_{{key}}" phi-tooltip-origin="top right" phi-tooltip-align="bottom right" phi-visible="{{block.menuShown}}" phi-visible-animation="slide-bottom">' +
                                                '<phi-menu phi-texture="paper">' +
                                                    '<phi-menu-item phi-icon-left="fa-pencil" ng-click="block.ctrl.openAction(\'modify\')">Modificar</phi-menu-item>' +
                                                    '<phi-menu-item phi-icon-left="fa-trash-o" ng-click="block.ctrl.openAction(\'remove\')">Eliminar</phi-menu-item>' +
                                                '</phi-menu>' +
                                            '</div>' +
                                        '</div>' + 

                                    '</div>' + 

                                    '<phi-block ' + 
                                        'ng-model="block" ' + 
                                        'assign-controller-to="block.ctrl"' + 
                                        'on-create="vm.attachBlock(block)"' + 
                                        'on-destroy="vm.removeBlock(block)"' + 
                                    '>' + 
                                    '</phi-block>' + 

                                '</div>' + 



                            '</div>' + 


                            '<div class="phi-block-adder" ng-show="vm.post.editable">' +
                                '<ul>' +
                                    '<li ng-if="vm.post.insertable.html" class="html" phi-icon="fa-font" ng-click="vm.addBlock(\'html\')">texto</li>' +
                                    '<li ng-if="vm.post.insertable.gallery" class="gallery" phi-icon="fa-files-o" ng-click="vm.addBlock(\'gallery\')">archivos</li>' +
                                    '<li ng-if="vm.post.insertable.video" class="video" phi-icon="fa-youtube-play" ng-click="vm.addBlock(\'video\')">video</li>' +
                                    '<li ng-if="vm.post.insertable.form" class="form" phi-icon="fa-pencil-square-o" ng-click="vm.addBlock(\'form\')">formulario</li>' +
                                '</ul>' +
                            '</div>' +

                        '</div>'

        };


        phiPostController.$inject = ["$scope", "phiApi"];
        function phiPostController($scope, phiApi) {

            var vm         = this;
            vm.post        = $scope.ngModel;

            vm.addBlock    = addBlock;
            vm.attachBlock = attachBlock;
            vm.removeBlock = removeBlock;
            vm.reorder     = reorder;

            $scope.$watch("ngModel", function(current, previous) {
                if (current == previous) {
                    return;
                }
                vm.post = current;
            });


            ///////////////////////


            function addBlock(blockType) {

                if (!vm.post.blocks) {
                    vm.post.blocks = [];
                }

                var newBlock = {
                    type: blockType,
                    order: vm.post.blocks.length
                };

                for (var property in vm.post.insertable[blockType]) {
                    newBlock[property] = vm.post.insertable[blockType][property];
                }

                vm.post.blocks.push(newBlock);
            };

            function attachBlock(block) {
                phiApi.post(vm.post.url + "/blocks", block)
                    .success(function(response) {
                        block.id = response.id;
                    });
            };

            function removeBlock(block) {

                if (block.id) {

                    phiApi.remove(vm.post.url + "/blocks/" + block.id)
                        .success(function() {
                            vm.post.blocks.splice(vm.post.blocks.indexOf(block), 1);
                        });

                } else {
                    vm.post.blocks.splice(vm.post.blocks.indexOf(block), 1);
                }

            };

            function reorder() {
                var blockIds = [];
                for (var cont = 0; cont < vm.post.blocks.length; cont++) {
                    blockIds.push(vm.post.blocks[cont].id);
                }
                phiApi.put(vm.post.url+"/blocks/", blockIds);
            };


        };


    };


})();