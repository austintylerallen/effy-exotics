// Cloud Atlas shader, adapted from user-supplied React Bits Pro source. See THIRD_PARTY_NOTICES.txt.
export const fragmentShader = `
precision highp float;

#define PI 3.14159265359
#define TAU 6.28318530718

varying vec2 vUv;

uniform vec2 uResolution;
uniform float uTime;
uniform float uFlow;
uniform float uWind;
uniform vec3 uSky;
uniform vec3 uLight;
uniform vec3 uShade;
uniform float uTransparent;
uniform float uTop;
uniform float uCeiling;
uniform float uFadeStart;
uniform float uCoverage;
uniform float uDensity;
uniform float uScale;
uniform float uRise;
uniform float uDip;
uniform float uOpacity;
uniform float uSeed;
uniform float uClear;

const mat2 SPIN_A = mat2(0.80, 0.60, -0.60, 0.80);
const mat2 SPIN_B = mat2(1.60, 1.20, -1.20, 1.60);

vec2 hash22(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  q += dot(q, q.yzx + 33.33);
  return fract((q.xx + q.yz) * q.zy) * 2.0 - 1.0;
}

mat2 rotation(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, s, -s, c);
}

float cellular(vec2 x, float phase) {
  vec2 cell = floor(x);
  vec2 f = fract(x);
  float inverse = 0.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 site = 0.5 + 0.5 * sin(phase + TAU * hash22(cell + g));
      vec2 r = g + site - f;
      float d2 = dot(r, r);
      float d4 = d2 * d2;
      float d8 = d4 * d4;
      inverse += 1.0 / max(d8 * d8, 1e-16);
    }
  }
  return 1.0 - pow(inverse, -0.125);
}

float lobe(vec2 cell, vec2 offset, vec2 f, mat2 turn) {
  float sgn = 1.0 - 2.0 * mod(offset.x + offset.y, 2.0);
  return sgn * dot(hash22(cell + offset), turn * (f - offset));
}

float curl(vec2 p, float angle) {
  vec2 cell = floor(p);
  vec2 f = fract(p);
  vec2 w = f * f * (3.0 - 2.0 * f);
  mat2 turn = rotation(angle + PI * (1.0 - mod(cell.x + cell.y, 2.0)));
  float n = mix(
    mix(lobe(cell, vec2(0.0, 0.0), f, turn), lobe(cell, vec2(1.0, 0.0), f, turn), w.x),
    mix(lobe(cell, vec2(0.0, 1.0), f, turn), lobe(cell, vec2(1.0, 1.0), f, turn), w.x),
    w.y
  );
  return 0.5 + n;
}

float puffs(vec2 p, float t) {
  float sum = 0.5 * cellular(p, t * 0.1);
  p = SPIN_A * p * 2.02;
  sum += 0.25 * cellular(p, t * 0.2);
  p = SPIN_A * p * 2.03;
  sum += 0.125 * cellular(p, t * 0.5);
  return (sum + 0.0625) / 0.9375;
}

float billows(vec2 p, float t) {
  float sum = 0.5 * curl(p, t * 0.1);
  p = SPIN_B * p;
  sum += 0.25 * curl(p, t * 0.4);
  p = SPIN_B * p;
  sum += 0.125 * curl(p, t * 0.7);
  p = SPIN_B * p;
  sum += 0.0625 * curl(p, t * 0.3);
  p = SPIN_B * p;
  sum += 0.0325 * curl(p, t * 0.3);
  return sum * 1.2;
}

float swirl(vec2 p, float t) {
  float sum = 0.5 * curl(p, t * 0.1);
  p = SPIN_B * p;
  sum += 0.25 * curl(p, t * 0.4);
  return sum * 1.2;
}

void main() {
  vec2 centered = vUv - vec2(.5);
  vec2 px = (vec2(.5) + centered / (1.0 + uClear * 2.5)) * uResolution;
  if (uTop > 0.5) px.y = uResolution.y - px.y;
  float h = px.y / uResolution.y;
  float t = uTime;
  float unit = max(uResolution.x, uResolution.y);

  float sx = (px.x + uWind * unit / uScale) / uResolution.y + uSeed * 3.1;
  float ridge = curl(vec2(sx * 0.6 + t * 0.01, 4.7), 0.0);
  ridge = 0.7 * ridge + 0.3 * curl(vec2(sx * 1.5 - t * 0.006, 8.3), 0.0);
  ridge = 0.5 + (ridge - 0.5) * 2.0;
  float tower = smoothstep(0.4, 0.85, ridge);
  float lift = mix(-uDip, uRise, tower);

  vec3 cloud = uLight;
  float amount = 0.0;
  if (h <= uCeiling + lift) {
    float churn = uFlow * 0.5;
    float drift = t * 0.15;
    vec2 uv = vec2(px.x, -px.y) / unit;
    uv += swirl(uv * uScale + vec2(0.0, churn * 0.5), churn) * 0.025;
    vec2 q = uv * uScale + vec2(uWind + uSeed * 17.3, drift + uSeed * 9.1);
    float shape = puffs(q, churn * 10.0);
    float detail = billows(q, churn * 10.0);

    float band = uCoverage * .8;
    shape = smoothstep(0.0, 1.0, shape) * band + uDensity;
    detail = smoothstep(0.0, 1.0, detail) * band + uDensity;
    float density = shape * detail;
    density *= smoothstep(0.0, 1.0, density);

    cloud = mix(uLight, uShade, smoothstep(0.5, 0.99, density));
    float cover = smoothstep(0.2, 0.5, density);
    float fade = 1.0 - smoothstep(uFadeStart + lift, uCeiling + lift, h);
    amount = cover * fade * uOpacity;
    vec2 radial = centered * uResolution / max(uResolution.x, uResolution.y);
    float edgeNoise = curl(radial * 9.0, uTime * .6) * .08;
    float radius = uClear * 1.1 - .12;
    amount *= smoothstep(radius, radius + .14, length(radial) + edgeNoise);

  }

  if (uTransparent > 0.5) {
    gl_FragColor = vec4(cloud * amount, amount);
  } else {
    gl_FragColor = vec4(mix(uSky, cloud, amount), 1.0);
  }
}
`;
