#= require_self
#= require_tree ./templates
#= require_tree ./models
#= require_tree ./collections
#= require_tree ./views
#= require_tree ./routers

var ConversateApp = {
	Models: {},
	Collections: {},
	Views: {},
	Routers: {},
	initialize: function(data, opened_conversation) {
		var self = this;
		self.opened_conversation = opened_conversation;
		self.conversations = new ConversateApp.Collections.Conversations(data.conversations);
		new ConversateApp.Routers.Conversations({ conversations: self.conversations});
		Backbone.history.start();

		setInterval(function () {
			console.log('fetch');
    		self.conversations.fetch();

    		// This bit should mimic the behavior of unread_count_string + favicon stuff.
    		// Not ideal, but works for now.
				var uc = $('.unread').length;
    		if (uc > 0) {
					document.title = uc + ' - Water Cooler'
					$('link[rel="icon"]').attr('href', '/assets/watercooler-unread.png');
				}
				else {
					document.title = 'Water Cooler'
					$('link[rel="icon"]').attr('href','/assets/watercooler.png');
				}

		}, 5000);
	}
}