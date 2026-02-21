declare function dldist(s1: string, s2: string, opts?: dldist.Options): number;

declare namespace dldist {
  interface Options {
    insWeight?: number;
    delWeight?: number;
    subWeight?: number;
    useDamerau?: boolean;
  }
}

export = dldist;
