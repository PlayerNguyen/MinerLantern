import * as path from "path";
import { getAdoptiumVersion3Url } from "../handler/property/launcher";
class AdoptiumRequest {
  arch:
    | "x64"
    | "x86"
    | "x32"
    | "ppc64"
    | "ppc64le"
    | "s390x"
    | "aarch64"
    | "arm"
    | "sparcv9"
    | "riscv64";

  version: number;
  heapSize: "normal" | "large";
  imageType: "jdk" | "jre";
  os: "windows" | "linux" | "mac";
  releaseType: "ga" | "ea";
  vendor: "eclipse";
}

export type AdoptionSystemArchitecture =
  | "x64"
  | "x86"
  | "x32"
  | "ppc64"
  | "ppc64le"
  | "s390x"
  | "aarch64"
  | "arm"
  | "sparcv9"
  | "riscv64";

export type AdoptionHeapSize = "normal" | "large";

export class AdoptiumRequestBuilder {
  private arch: AdoptionSystemArchitecture;
  private version: number;
  private os: "windows" | "linux" | "mac";

  private heapSize: "normal" | "large" = "normal";
  private imageType: "jdk" | "jre" = "jre";

  private releaseType: "ga" | "ea" = "ga";
  private javaImplementation: "hotspot" = "hotspot";
  private vendor: "eclipse" = "eclipse";

  public static create(): AdoptiumRequestBuilder {
    return new AdoptiumRequestBuilder();
  }

  public setArch(arch: AdoptionSystemArchitecture): AdoptiumRequestBuilder {
    this.arch = arch;
    return this;
  }

  public setVersion(version: number): AdoptiumRequestBuilder {
    this.version = version;
    return this;
  }

  public setHeapSize(heapSize: AdoptionHeapSize): AdoptiumRequestBuilder {
    this.heapSize = heapSize;
    return this;
  }

  public setImageType(imageType: "jdk" | "jre"): AdoptiumRequestBuilder {
    this.imageType = imageType;
    return this;
  }

  public setOs(os: "windows" | "linux" | "mac"): AdoptiumRequestBuilder {
    this.os = os;
    return this;
  }

  public setReleaseType(releaseType: "ga" | "ea"): AdoptiumRequestBuilder {
    this.releaseType = releaseType;
    return this;
  }

  public setVendor(vendor: "eclipse"): AdoptiumRequestBuilder {
    this.vendor = vendor;
    return this;
  }

  public setJavaImplementation(
    javaImplementation: "hotspot"
  ): AdoptiumRequestBuilder {
    this.javaImplementation = javaImplementation;
    return this;
  }

  /**
   * Returns a built adoptium url request in the form of a url. The following is a sample of the url:
   *  /v3/binary/latest/{feature_version}/{release_type}/{os}/{arch}/{image_type}/{jvm_impl}/{heap_size}/{vendor}
   *
   * @returns {string} a built adoptium url from request
   */
  public requestBinaryUrl(): string {
    return (
      getAdoptiumVersion3Url() +
      path.join(
        `binary`,
        `latest`,
        `${this.version}`,
        `${this.releaseType}`,
        `${this.os}`,
        `${this.arch}`,
        `${this.imageType}`,
        `${this.javaImplementation}`,
        `${this.heapSize}`,
        `${this.vendor}`
      )
    );
  }
}

export class JavaRuntimeBuilder extends AdoptiumRequestBuilder {}
