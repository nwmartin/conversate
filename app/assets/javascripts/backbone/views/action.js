Structural.Views.Action = Support.CompositeView.extend({
  className: function() {
    var classes = 'act btn-faint-container';
    classes += ' act-' + this.model.get('type').replace('_', '-');
    if (this.model.isOwnAction) {
      classes += ' act-my-action';
    }
    return classes;
  },

  messageTemplate: JST['backbone/templates/actions/message'],
  updateUsersTemplate: JST['backbone/templates/actions/update_users'],
  retitleTemplate: JST['backbone/templates/actions/retitle'],
  deletionTemplate: JST['backbone/templates/actions/deletion'],

  initialize: function(options) {
  },
  render: function() {
    var template;
    switch(this.model.get('type')) {
      case 'message':
        template = this.messageTemplate;
        break;
      case 'update_users':
        template = this.updateUsersTemplate;
        break;
      case 'retitle':
        template = this.retitleTemplate;
        break;
      case 'deletion':
        template = this.deletionTemplate;
        break;
    }
    this.$el.html(template({action: this.model}));
    return this;
  },
  events: {
    'click .act-delete': 'deleteMessage'
  },
  deleteMessage: function(e) {
    // TODO: Delete the message.
  }
});