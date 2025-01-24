## Kinesis put record AWS CLI

input

```bash
aws kinesis put-record --stream-name emi-kinesis-stream --data "aGVsbG8=" --partition-key PartitionKey2
```

output

```bash
(base) user@Users-MacBook-Pro kinesis_messages % ./put_command.sh
{
    "ShardId": "shardId-000000000003",
    "SequenceNumber": "49659891250307807075198915301531127305751655679424200754",
    "EncryptionType": "KMS"
}
(base) user@Users-MacBook-Pro kinesis_messages %
```
