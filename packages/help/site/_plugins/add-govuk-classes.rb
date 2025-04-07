mappings = {
    'h1' => 'govuk-heading-xl',
    'h2' => 'govuk-heading-l',
    'h3' => 'govuk-heading-m',
    'h4' => 'govuk-heading-s',
    'p'  => 'govuk-body',
    'a'  => 'govuk-link',
    'ul' => 'govuk-list govuk-list--bullet',
    'table' => 'govuk-table',
    'thead' => 'govuk-table__head',
    'tr' => 'govuk-table__row',
    'th' => 'govuk-table__header',
    'td' => 'govuk-table__cell'
}

Jekyll::Hooks.register :pages, :post_render do |document|
    require 'nokogiri'

    if document.name =~ /.*\.html/ || document.name =~ /.*\.md/
        doc = Nokogiri::HTML(document.output)
        mappings.each do |el, klass|
            pre = doc.css(el).add_class(klass)
        end

        document.output = doc.to_html
    end
end