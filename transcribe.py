import whisper


def transcribe_audio(wav):
    model = whisper.load_model("base.en")

    result = model.transcribe(wav, fp16=False)

    print(result["text"])
    return result["text"]