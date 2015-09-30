# Phi-UI

UI kit of CSS and Angular.js components.  Based on material.angular.org but preserving
the following principles:

1. Portability
Easy to include in any project without breaking global styles or overriding properies or components.
Every component is prefixed with "phi-"

2. Usability
Easy to implement off the bat without having to modify CSS

3. Customizability
Ease to style


This is a work in progress.


The main docs page is build with phi.ui itself.

It showcases every element, and looks like this:

'''
<phi-app>

    <!-- global modal -->
    <phi-modal phi-visible="false"></phi-modal>

    <!-- The current page (which is just a card) -->
    <phi-card>

        <phi-cover>
        </phi-cover>

        <phi-contents>
        </phi-contents>
    </phi-card>

</phi-app>