App.ItemsRoute = Ember.Route.extend {
  renderTemplate: (controller, model) ->
    @render('items/layout')
}
App.ItemsIndexRoute = Ember.Route.extend {
  model: (params) ->
    App.Item.find()
  
  renderTemplate: (controller, model) ->
    @render('items/index')
}
App.ItemsShowRoute = Ember.Route.extend {
  model: (params) ->
    App.Item.find(params.item_id)
  
  renderTemplate: (controller, model) ->
    @render('items/show')
}


App.ItemsIndexRouteController = Ember.ArrayController.extend {
  
}