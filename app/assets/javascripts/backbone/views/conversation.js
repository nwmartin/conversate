// A view for an actual conversation in the conversations list.

Structural.Views.Conversation = Support.CompositeView.extend({
  className: function() {
    var classes = 'cnv';

    if (this.model.unreadCount() > 0) {
      classes += ' cnv-unread';
    }

    if (this.model === Structural._conversation) {
      classes += ' cnv-current';
    }

    var unread = this.model.unreadCount();
    if (unread > 0) {
      classes += ' cnv-unread';
    }

    return classes;
  },
  template: JST.template('conversations/conversation'),
  initialize: function(options) {
    options = options || {};
    this.user = options.user;

    this.model.on('updated', this.reRender, this);
    this.listenTo(Structural, 'changeConversation', this.changeConversation);
  },
  render: function() {
    this.$el.html(this.template({
      conversation: this.model
    }));

    // The first time backbone calls className we don't have some data?
    this.reClass();

    return this;
  },
  reClass: function() {
    this.el.className = this.className();
  },
  reRender: function() {
    this.reClass();
    this.render();
  },
  events: {
    'click': 'view'
  },

  // TODO: I'm specifically trying to call out what we're doing with the view. Should this be in the controller?
  changeConversation: function(conversation) {
    this.reRender();
  },

  view: function(e) {
    e.preventDefault();

    Structural.viewConversation(this.model);
  }
});
