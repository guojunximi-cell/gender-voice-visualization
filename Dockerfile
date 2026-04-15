FROM mambaorg/micromamba:1.5.8

USER root

RUN apt-get update && apt-get install -y --no-install-recommends \
        ffmpeg sox praat libmagic1 ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN micromamba create -y -n mfa -c conda-forge \
        python=3.11 montreal-forced-aligner \
    && micromamba clean -a -y

ENV MAMBA_ROOT_PREFIX=/opt/conda
ENV MFA_BIN=/opt/conda/envs/mfa/bin/mfa
ENV PATH=/opt/conda/envs/mfa/bin:$PATH
ENV MFA_ROOT_DIR=/opt/mfa_root
RUN mkdir -p /opt/mfa_root && chmod -R 777 /opt/mfa_root

RUN micromamba run -n mfa mfa model download acoustic english_mfa \
 && micromamba run -n mfa mfa model download dictionary english_mfa \
 && micromamba run -n mfa mfa model download acoustic mandarin_mfa \
 && micromamba run -n mfa mfa model download dictionary mandarin_mfa \
 && micromamba run -n mfa mfa model inspect acoustic mandarin_mfa \
 && ls -la /opt/mfa_root

RUN micromamba run -n mfa pip install --no-cache-dir \
        python-magic maxminddb

WORKDIR /app
COPY . /app

RUN printf '{\n\
\t"dev"        : false,\n\
\t"logs"       : "",\n\
\t"recordings" : "/tmp/gender-voice-rec/",\n\
\t"ffmpeg"     : "/usr/bin/ffmpeg",\n\
\t"sox"        : "/usr/bin/sox",\n\
\t"mfa"        : "/opt/conda/envs/mfa/bin/mfa",\n\
\t"praat"      : "/usr/bin/praat"\n\
}\n' > /app/settings.json \
 && mkdir -p /tmp/gender-voice-rec

ENV PYTHONUTF8=1
EXPOSE 8888
CMD ["micromamba", "run", "-n", "mfa", "python", "serve.py"]
