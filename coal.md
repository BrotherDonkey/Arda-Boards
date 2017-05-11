# Coalition For Refugees from Burma

------

A website for the Coalition for Refugees from Burma, a nonprofit devoted to helping refugees living in Seattle through a comprehensive set of educational programs. Find them online (and donate to a great cause) [on their live site](http://www.allburmarefugees.org/).

## Specs
This site was built with Jekyll, Sass, jQuery, and some vanilla JavaScript. It was made as a pro bono project by [Will Bjorn](http://jackofalltrad.es).

## Notes
#### List of Includes:
+ {% include head.html %}
+ {% include mobile_nav.html %}
(optional) {% include social-media.html %}
+ {% include header.html%}
+ (optional) {% for post in site.posts limit:3 %}
+ (optional) {% include fourWideCircleImages.html%}
+ {% include footer.html%}
+ Image: consider in tandem with front matter:
image: path/to/post/image.jpg
+ {% if page.image %}
+ {% else %} {% endif %}