App.Router.map (match) ->
  match('/items').to('items', (match) ->
    match('/').to('index')
    match('/:item_id').to('show')
  )