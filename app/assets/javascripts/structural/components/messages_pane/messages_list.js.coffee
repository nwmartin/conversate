{div} = React.DOM

# In chromium at least, the scroll top plus node height is consistently one
# pixel less than the scroll height.
SCROLL_FUDGE = 5

MessagesList = React.createClass
  displayName: 'Messages List'

  componentWillUpdate: ->
    dom = @getDOMNode()
    scrollBottom = dom.scrollTop + dom.offsetHeight + SCROLL_FUDGE
    @pinned = scrollBottom >= dom.scrollHeight
  componentDidUpdate: ->
    if @pinned
      dom = @getDOMNode()
      dom.scrollTop = dom.scrollHeight

  getDefaultProps: -> messages: []

  render: ->
    if @props.loading
      contents = Structural.Components.LoadingMessages()
    else if @props.none
      contents = undefined
    else
      makeMessage = (message) =>
        Structural.Components.Message(
          message: message,
          currentUser: @props.currentUser
          conversation: @props.conversation
          folder: @props.folder
          key: message.id
        )
      contents = _.map(@props.messages, makeMessage)

    div className: 'messages-list', contents

Structural.Components.MessagesList = React.createFactory(MessagesList)