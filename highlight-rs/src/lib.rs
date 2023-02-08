mod utils;

use syntect::{highlighting::ThemeSet, html::highlighted_html_for_string, parsing::SyntaxSet};
use wasm_bindgen::prelude::*;

// base16-ocean.dark
// base16-eighties.dark
// base16-mocha.dark
// base16-ocean.light
// InspiredGitHub
// Solarized (dark)
// Solarized (light)

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn highlight(code: &str, language: &str, theme: &str) -> String {
    let syntax_set = SyntaxSet::load_defaults_newlines();
    let theme_set = ThemeSet::load_defaults();
    let theme = &theme_set.themes[theme];
    let syntax = syntax_set.find_syntax_by_token(language).unwrap();
    let html = highlighted_html_for_string(code, &syntax_set, syntax, theme);
    html.unwrap()
}
