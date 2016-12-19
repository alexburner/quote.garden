I KNO I KNO

I should just add SCSS to this project and re-compile Baseguide myself.

But I'm lazy, so here's how I make custom buttom colors.

Take this chunk:

$button-bg: #<MY COLOR HERE>;
$button-hover-bg: darken($button-bg, 10%);

.btn {
    background-color: $button-bg;

    &:hover,
    &:focus,
    &:active {
        background-color: $button-hover-bg;
    }
}

And run it through here:
http://beautifytools.com/scss-compiler.php