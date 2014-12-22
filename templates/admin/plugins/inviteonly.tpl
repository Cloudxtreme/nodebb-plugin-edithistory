<div class="col-md-12">
  <div class="panel panel-default">
    <div class="panel-heading">Edit History Settings</div>
    <div class="panel-body">
      <form role="form" class="ehist-settings">
      </form>
    </div>
  </div>
</div>

<script type="text/javascript">
  require(['settings'], function(Settings) {
        var wrapper = $('.ehist-settings');

        wrapper.find('input[type="checkbox"]').on('change', function(e) {
            var target = $(e.target),
                input = wrapper.find(target.attr('data-toggle-target'));
            if (target.is(':checked')) {
                input.prop('disabled', false);
            } else {
                input.prop('disabled', true);
            }
        });
  });

</script>

