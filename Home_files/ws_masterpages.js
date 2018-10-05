function _adjustMasterPage() {
	var $section = $("#content-body");
	var $master = $section.find(".master-element");
	var $parent = $master.parent();

	if($parent.length === 1 && !window.skipAdjustMasterPage) {
		var masterPosition = $parent.position();

		var masterTop = masterPosition.top;
		var masterHeight = $parent.outerHeight();
		var masterBottom = masterTop + masterHeight;

		var masterLeft = masterPosition.left;
		var masterWidth = $parent.outerWidth();
		var masterRight = masterLeft + masterWidth;

		var renderHeight = $master.outerHeight();
		var renderBottom = masterTop + renderHeight;

		var $elements = $section.find(".element").not($parent);

		var $bottomElement = _getBottomElement($elements);
		var orgBottomElementDiff = $section.height();
		if($bottomElement) {
			orgBottomElementDiff -= ($bottomElement.position().top + $bottomElement.outerHeight());
		} else {
			orgBottomElementDiff -= ($parent.position().top + $parent.outerHeight());
		}

		var newSectionHeight = renderBottom;
		$elements.each(function() {
			var $this = $(this);
			var thisPos = $this.position();
			var thisTop = thisPos.top;

			if(thisTop >= masterBottom) {
				var thisLeft = thisPos.left;
				var thisWidth = $this.outerWidth();
				var thisRight = thisLeft + thisWidth;

				if(thisLeft <= masterRight && thisRight >= masterLeft) {
					var newTop = renderBottom + (thisTop - masterBottom);
					$this.css("top", newTop);

					var thisHeight = $this.outerHeight();
					newSectionHeight = Math.max(newSectionHeight, newTop + thisHeight);
				}
			}
		});

		if($bottomElement) {
			newSectionHeight = (Math.max(newSectionHeight, $bottomElement.position().top + $bottomElement.outerHeight())) + orgBottomElementDiff;

			if(newSectionHeight > 0 && newSectionHeight > $section.height()) {
				$section.height(newSectionHeight);
			}
		} else {
			newSectionHeight += orgBottomElementDiff;
			if(newSectionHeight > 0) {
				$section.height(newSectionHeight);
			}
		}

		$section.addClass("master-page-adjusted");
		$parent.outerHeight(renderHeight);
	}
}

function _revertMasterPage() {
	var $section = $("#content-body");
	var $master = $section.find(".master-element");
	var $parent = $master.parent();

	if($section.hasClass("master-page-adjusted") && $parent.length === 1) {
		$section.removeClass("master-page-adjusted").find(".element").not(this.$el).trigger("revertPosition");

		// section height is already adjusted in the editorView.
	}
}

function _getBottomElement($elements) {
	if($elements.length) {
		var $el = $($elements.get(0));
		$elements.each(function() {
			if($(this).position().top > $el.position().top) {
				$el = $(this);
			}
		});
		return $el;
	}
	return false;
}
