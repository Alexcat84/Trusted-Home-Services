"""Generates a painted frame for border-image.

The shape is a ring: a ragged outer edge and a ragged inner edge, so that when
CSS slices the square the four sides and the corners all carry paint. Kept as a
placeholder until the real scanned stroke arrives.
"""
import math
import random

SIZE = 400
BAND = 120          # 30% of the size, which is the slice value used in the CSS
SEED = 20260830

random.seed(SEED)


def edge(a, b, steps, amp, drift):
    """Walk from point a to b, wandering sideways to fake bristle marks."""
    ax, ay = a
    bx, by = b
    dx, dy = bx - ax, by - ay
    length = math.hypot(dx, dy)
    nx, ny = -dy / length, dx / length     # unit normal
    pts = []
    offset = 0.0
    for i in range(steps + 1):
        t = i / steps
        offset += random.uniform(-drift, drift)
        offset = max(-amp, min(amp, offset))
        # An occasional deeper bite, the way a loaded brush skips.
        bite = random.uniform(amp * 0.8, amp * 1.9) if random.random() < 0.10 else 0.0
        o = offset - bite
        pts.append((ax + dx * t + nx * o, ay + dy * t + ny * o))
    return pts


def ring(inset, amp, drift, reverse=False):
    lo, hi = inset, SIZE - inset
    corners = [(lo, lo), (hi, lo), (hi, hi), (lo, hi)]
    if reverse:
        corners.reverse()
    pts = []
    for i in range(4):
        pts += edge(corners[i], corners[(i + 1) % 4], 26, amp, drift)
    return pts


def path(pts):
    d = 'M%.1f %.1f' % pts[0]
    for x, y in pts[1:]:
        d += 'L%.1f %.1f' % (x, y)
    return d + 'Z'


# Outer edge bites outward, inner edge bites inward, so the band varies in width
# the way a real stroke does.
outer = ring(8, 7, 3)
inner = ring(114, 8, 4, reverse=True)
# A second, lighter pass just inside the first, the way a brush leaves a wet edge.
outer2 = ring(100, 6, 3)
inner2 = ring(126, 7, 3, reverse=True)

# Loose flecks just off the inner edge, where a brush throws paint.
flecks = []
for _ in range(26):
    side = random.randrange(4)
    along = random.uniform(0.08, 0.92)
    depth = random.uniform(118, 140)
    if side == 0:
        cx, cy = SIZE * along, depth
    elif side == 1:
        cx, cy = SIZE - depth, SIZE * along
    elif side == 2:
        cx, cy = SIZE * along, SIZE - depth
    else:
        cx, cy = depth, SIZE * along
    rx = random.uniform(1.4, 5.2)
    ry = random.uniform(1.0, 3.4)
    rot = random.uniform(0, 180)
    flecks.append(
        '<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" transform="rotate(%.0f %.1f %.1f)"/>'
        % (cx, cy, rx, ry, rot, cx, cy)
    )

svg = (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" '
    'preserveAspectRatio="none">'
    '<g fill="#0a233c">'
    '<path fill-rule="evenodd" d="%s %s"/>'
    '<g opacity="0.45"><path fill-rule="evenodd" d="%s %s"/>%s</g>'
    '</g></svg>'
) % (SIZE, SIZE, path(outer), path(inner), path(outer2), path(inner2), ''.join(flecks))

import io
import sys
io.open(sys.argv[1], 'w', encoding='utf-8').write(svg)
print('%s escrito, %d bytes' % (sys.argv[1], len(svg)))
