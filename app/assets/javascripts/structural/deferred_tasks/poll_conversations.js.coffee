{Folders, ActiveFolder, Conversations} = Structural.Stores
{UpdateConversationList} = Structural.Actions
{arrayToIndexedHash} = Structural.Data.Collection

POLL_INTERVAL = 5 * 1000

PollConversations = new Hippodrome.DeferredTask
  action: Structural.Actions.StartApp
  task: (payload) ->
    doPoll = ->
      activeFolder = Folders.byId(ActiveFolder.id())

      success = (data) ->
        # This is our attempt to not send out of date API responses to the
        # stores
        if Conversations.lastActionId() != lastConversationAction
          return

        UpdateConversationList(arrayToIndexedHash(data), activeFolder)
        setTimeout(doPoll, POLL_INTERVAL)
      error = ->
        setTimeout(doPoll, POLL_INTERVAL)

      lastConversationAction = Conversations.lastActionId()
      Structural.Api.Conversations.index(activeFolder, success, error)

    setTimeout(doPoll, POLL_INTERVAL)

Structural.Tasks.PollConversations = PollConversations
