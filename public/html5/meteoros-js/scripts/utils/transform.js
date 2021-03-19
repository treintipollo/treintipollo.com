"use strict"
{
	class Transform
	{
		constructor(owner)
		{
			this._owner = owner;

			this._colorTransform = new ColorTransform();

			this._on_color_transform_change = () =>
			{
				if (!this._owner.filters)
		 			this._owner.filters = [];

		 		if (!this._owner.filters.includes(this._colorTransform._filter))
		 			this._owner.filters.push(this._colorTransform._filter);
		 		
		 		this.ApplyFilters();
			}
			
			// setup listeners to update when the color transform changes
		 	this._colorTransform.addEventListener("change", this._on_color_transform_change);
		}

		get colorTransform()
		{
			return this._colorTransform;
		}

		set colorTransform(v)
		{
			// No change
			if (this._colorTransform === v)
				return;

			// The current and incoming are different and both are defined
			if (this._colorTransform && v && (this._colorTransform !== v))
			{
				// Make sure the owner is in a neutral state, no filters applied
				
				const f1 = this._colorTransform._filter
				const i1 = this._owner.filters.indexOf(f1);

				if (i1 !== -1)
					this._owner.filters.splice(i1, 1);

				const f2 = v._filter;
				const i2 = this._owner.filters.indexOf(f2);

				if (i2 !== -1)
					this._owner.filters.splice(i2, 1);

				this.ApplyFilters();
			}

			// Passing a truthy value
			if (v)
			{
				// Make sure the owner has filters
				if (!this._owner.filters)
		 			this._owner.filters = [];

		 		// Push it at the end if it isn't already there
		 		if (!this._owner.filters.includes(v._filter))
		 			this._owner.filters.push(v._filter);

		 		// setup listeners to update when the color transform changes
		 		v.addEventListener("change", this._on_color_transform_change);

				this.ApplyFilters();
			}

			// Passing a falsy value
			if (!v)
			{
				// Remove the filter from the owner

				// If the owner has filters and a previous color transform...
				if (this._owner.filters && this._colorTransform)
				{
					// Look for filter in the owner's collection
					for (let i = this._owner.filters.length - 1; i >= 0; i--)
					{
						const filter = this._owner.filters[i];
						
						// Remove it if found
						if (filter === this._colorTransform._filter)
						{
							// Remove the filter
							this._owner.filters.splice(i, 1);

							this.ApplyFilters();
						}
					}
				}
			}

			// Remove the change listener from the old color transform
			if (this._colorTransform && (this._colorTransform !== v))
				this._colorTransform.removeEventListener("change", this._on_color_transform_change);

			// update the internal reference
			this._colorTransform = v;
		}

		ApplyFilters()
		{
			// Update the cache so the change is shown
			if (this._owner.cacheCanvas)
	 		{
				this._owner.updateCache();
	 		}
	 		else
	 		{
	 			const rect = this._owner.getBounds();
	 			this._owner.cache(rect.x, rect.y, rect.width, rect.height);
	 		}
		}
	}

	window.Transform = Transform;
}