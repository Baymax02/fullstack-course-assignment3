(function(){
'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController',NarrowItDownController)
  .service('MenuSearchService',MenuSearchService)
  .directive('foundItems',FoundItemsDirective);

  function FoundItemsDirective(){
    var ddo = {
      templateUrl:'loader\\itemsloaderindicator.template.html',
      scope: {
        items: '<',
        onRemove: '&'
      },
      controller: FoundItemsDirectiveController,
      controllerAs: 'found',
      bindToController: true
    };
     return ddo;
  }

  function FoundItemsDirectiveController()
  {
    var found = this;

  }


  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService){
    var found = this;
    
    found.getMatchedMenuItems = function(searchTerm)
    {
      if(searchTerm !== undefined && searchTerm)
      {
        MenuSearchService.getMatchedMenuItems(searchTerm).then(function(result){
          found.items = result;
          found.emptyMessage = found.items.length < 1 ? true:false;
        });

      }
      else {
        found.items = "";
        found.emptyMessage = true;
      }



    }

    found.removeItem = function(itemIndex){
      found.items.splice(itemIndex, 1);
    }

  }

  MenuSearchService.$inject = ['$http'];
  function MenuSearchService($http)
  {
    var service = this;

    service.getMatchedMenuItems = function(searchTerm)
    {
      return  $http({
          method:"GET",
          url: ("https://davids-restaurant.herokuapp.com/menu_items.json")
        }).then(function (result) {
            // process result and only keep items that match
            var menu = result.data.menu_items;
            var foundItems = [];
            for(var i=0; i<menu.length; i++)
            {
              var menu_desc = menu[i].description;
              if(menu_desc.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1)
              {
                foundItems.push(menu[i]);
              }
            }
            return foundItems;
        });

    }

  }

})();
