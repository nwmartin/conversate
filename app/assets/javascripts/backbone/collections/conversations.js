ConversateApp.Collections.Conversations = Backbone.Collection.extend({
	model: ConversateApp.Models.Conversation,
  url: function() {
    if (ConversateApp.opened_conversation) {
      return '/conversations?id=' + ConversateApp.opened_conversation
    }
    return '/conversations'
  },
  comparator: function (conversation) {
    return conversation.most_recent_event;
  }
});

