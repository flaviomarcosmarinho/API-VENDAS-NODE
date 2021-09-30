import handlebars, { template } from 'handlebars';

interface ITemplateVariable {
  [key: string]: string | number;
}

interface IParceMailTemplate {
  template: string;
  variables: ITemplateVariable;
}

export default class HandlebarsMailTemplate {
  public async parse({
    template,
    variables,
  }: IParceMailTemplate): Promise<string> {
    const parseTemplate = handlebars.compile(template);

    return parseTemplate(variables);
  }
}
