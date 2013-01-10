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


App.ItemsIndexRouteController = Ember.ArrayController.extend {
  
}